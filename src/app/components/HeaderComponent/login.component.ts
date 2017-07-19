import {Component, OnInit} from "@angular/core";
import {User} from "../../entites/user";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

declare var $: any

@Component({
  selector: 'mylogin',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User;
  loading = false;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  ngOnInit() {
    $('#error_login').hide();
  }

  login() {
    this.loading = true;
    this.authService.login(this.user.login, this.user.password)
      .subscribe(
        data => {
          this.loading = false;
          this.router.navigate([('')]);
        },
        error => {
          this.loading = false;
          $('#error_login').show();
        }
      );
  }
}
