import { Component, ViewEncapsulation } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'app works!';
}
