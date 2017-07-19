import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import {AppRoutingModule} from "./app-routing.module";
import { AppComponent }        from './app.component';
import {LoginComponent} from "./components/HeaderComponent/login.component";
import {SecondComponent} from "./components/SecondComponent";
import {UserService} from "./services/user.service";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    SecondComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    UserService
  ]
})
export class AppModule { }
