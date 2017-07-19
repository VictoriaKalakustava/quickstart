import {EventEmitter, Injectable} from "@angular/core";
import {RequestOptions, URLSearchParams, Response} from "@angular/http";
import {User} from "../entites/user";
import {AuthHttp} from "angular2-jwt";
import "rxjs/add/operator/map";
import {AuthService} from "./auth.service";
import {CoreService} from "./core/core.service";
import {UploadResult} from "../entites/upload.result";

@Injectable()
export class UserService extends CoreService {

  private user: User = new User();
  authData: EventEmitter<User> = new EventEmitter();

  constructor(private authHttp: AuthHttp) {
    super();
    if (AuthService.loggedIn()) {
      this.getCurrentUser().subscribe(
        data => {
          this.user = data;
          this.authData.emit(this.user);
        }
      );
    }
  }

  getAuthUser(): User {
    let user: User = new User();
    user.about = this.user.about;
    user.lastName = this.user.lastName;
    user.firstName = this.user.firstName;
    user.sex = this.user.sex;
    user.login = this.user.login;
    user.enabled = this.user.enabled;
    user.email = this.user.email;
    user.id = this.user.id;
    user.image = this.user.image;
    user.role = this.user.role;
    return user;
  }

  updateAuthUser(user: User) {
    this.user = user;
    let newUser = this.getAuthUser();
    this.authData.emit(newUser);
  }

  getUser1() {
    console.log("User Service. getUser1")
    return this.authHttp.get(`${this.webServiceEndpoint}/test`)
      .map((response: Response) => response.json());
  }

  changeImage(uploadDTO: UploadResult) {
    return this.authHttp.post(`${this.webServiceEndpoint}/protected/user/update/image`, uploadDTO)
      .map((response: Response) => response.json());
  }


  getById(id: number) {
    return this.authHttp.get(`${this.webServiceEndpoint}/user/` + id)
      .map((response: Response) => response.json());
  }

  create(user: User) {
    return this.authHttp.post(`${this.webServiceEndpoint}/user`, user)
      .map((response: Response) => response);
  }

  validateCaptcha(key: string) {
    return this.authHttp.post(`${this.webServiceEndpoint}/user/captcha`, key)
      .map((response: Response) => response.json());
  }

  update(user: User) {
    return this.authHttp.put(`${this.webServiceEndpoint}/protected/user`, user).map((response: Response) => {
      if (response.json() && response.json().username == this.user.login) {
        this.updateAuthUser(response.json());
      }
      response.json();
    });
  }

  recoverPassword(email: string) {
    return this.authHttp.post(`${this.webServiceEndpoint}/user/recover`, email)
      .map((response: Response) => response.json());
  }

  delete(id: number) {
    return this.authHttp.delete(`${this.webServiceEndpoint}/protected/user/` + id)
      .map((response: Response) => response.json());
  }

  getCurrentUser() {
    return this.authHttp.get(`${this.webServiceEndpoint}/protected/user/me`)
      .map((response: Response) => response.json());
  }

  checkUsername(username: String) {
    return this.authHttp.get(`${this.webServiceEndpoint}/user/check/` + username)
      .map((response: Response) => response.json());
  }

  checkEmail(email: string) {
    return this.authHttp.post(`${this.webServiceEndpoint}/user/check/email`, email)
      .map((response: Response) => response.json());
  }

  updatePassword(oldPassword: string, newPassword: string) {
    return this.authHttp.post(`${this.webServiceEndpoint}/protected/user/password`,
      {"old": oldPassword, "new": newPassword}).map((response: Response) => response.json());
  }
}
