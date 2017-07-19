import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";
import {SecondComponent} from "./components/SecondComponent";
import {APP_BASE_HREF} from "@angular/common";
import {LoginComponent} from "./components/HeaderComponent/login.component";
import {AppComponent} from "./app.component";

const routes: Routes = [
  {path: '', component:AppComponent},
  {path: 'login', component: LoginComponent},
  {path: 'second', component: SecondComponent}

  ];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}]
})
export class AppRoutingModule {
}
