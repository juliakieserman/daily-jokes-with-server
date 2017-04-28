import { Component, OnInit } from '@angular/core';
import { HomePageComponent } from './home-page/home-page.component';
import { FlowService } from './services/flow/flow.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FlowService]
})
export class AppComponent implements OnInit {
  private showSideNav: boolean = false;

  constructor(private flowService: FlowService) {}

  ngOnInit() {
    this.flowService.sideNavToggle.subscribe(
      (toggle) => {
        this.showSideNav = toggle;
      }
    )
  }
}
