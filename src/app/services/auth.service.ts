import {CoreService} from "./core/core.service";
import {EventEmitter, Injectable} from "@angular/core";
import {AuthHttp, JwtHelper} from "angular2-jwt";
import {Observable} from "rxjs";
import {Http, Response, Headers} from "@angular/http";
import {UserService} from "./user.service";

@Injectable()
export class AuthService extends CoreService {

  refreshSubscription: any;

  isLoggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: Http,
              private authHttp: AuthHttp,
              private jwtHelper: JwtHelper,
              private userService: UserService) {
    super();
  }

  public static loggedIn(): boolean {
    let jwt: JwtHelper = new JwtHelper();
    return localStorage.getItem('token') !== null && !jwt.isTokenExpired(localStorage.getItem('token'));
  }

  login(username: string, password: string) {
    return this.http.post(`${this.webServiceEndpoint}/`,
      JSON.stringify({username: username, password: password}))
      .map((response: Response) => {
        let token = response.json() && response.json().token;
        let refresh = response.json() && response.json().refreshToken;
        if (token) {
          localStorage.setItem('token', token);
        }
        if (refresh) {
          localStorage.setItem('refresh', refresh);
        }
        if (response.status == 200) {
          this.initAuthUser();
          this.startupTokenRefresh();
        }
      });
  }

  private initAuthUser() {
    this.userService.getCurrentUser().subscribe(
      data => {
        this.userService.updateAuthUser(data);
        this.isLoggedIn.emit(true);
      }
    );
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (AuthService.canBeRefreshed()) {
      let source = this.authHttp.tokenStream.flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = (exp.valueOf() - now) * 0.95;

          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay < 0 ? 1 : delay);
        });

      // Once the delay time from above is
      // reached, get a new JWT and schedule
      // additional refreshes
      source.subscribe(() => {
        this.refreshToken();
      });
    }
  }

  public static canBeRefreshed(): boolean {
    let jwt: JwtHelper = new JwtHelper();
    return localStorage.getItem('refresh') !== null && !jwt.isTokenExpired(localStorage.getItem('refresh'));
  }

  public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    let source = this.authHttp.tokenStream.flatMap(
      token => {
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat)) * 0.95;

        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.refreshToken();
    });
  }

  refreshToken() {
    let headers: Headers = new Headers();
    headers.append('X-Authorization', 'Bearer ' + localStorage.getItem('refresh'));

    let source = this.http.get(`${this.webServiceEndpoint}/`, {headers})
      .map((response: Response) => response.json());

    source.subscribe(
      data => {
        let token = data && data.token;
        console.log('refreshed token: ', token);
        if (token) {
          localStorage.setItem('token', token);
          this.isLoggedIn.emit(true);
          this.userService.getCurrentUser().subscribe(
            item => {
              this.userService.updateAuthUser(item);
            }
          );
        }
        if (this.refreshSubscription == null && AuthService.canBeRefreshed()) {
          this.scheduleRefresh();
        }
      }
    );
  }

}
