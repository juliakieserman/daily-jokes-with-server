import { Component } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { FlowService } from './services/flow/flow.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FlowService]
})
export class AppComponent {
  title = 'app works!';
  private sideView: boolean;
  private flowService: FlowService;

  constructor() {
      this.sideView = this.flowService.getShowCategories();
  }
  
}
