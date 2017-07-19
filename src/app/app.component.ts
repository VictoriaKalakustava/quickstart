import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h2>My app</h2>
    <nav>
      <a routerLink="/second" routerLinkActive="active">second</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
