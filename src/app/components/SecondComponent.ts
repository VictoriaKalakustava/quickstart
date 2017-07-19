
import {Component} from "@angular/core";
import {UserService} from "../services/user.service";
import {User} from "../entites/user";

@Component({
  selector: 'second',
  template: '<div>{{user.firstName, user.lastName}}</div>'
})
export class SecondComponent
{
  user: User = new User();

  constructor(
    private userService: UserService) {this.userService.getUser1().subscribe(
      data => {
        this.user = data;
        console.log("In subscribe");
      }
      );
    console.log(this.user);
  }

}
