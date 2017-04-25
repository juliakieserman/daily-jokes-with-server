import { Component, OnInit } from '@angular/core';
import { FlowService } from '../../services/flow/flow.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  providers: [FlowService]
})
export class HeaderComponent implements OnInit {

  private flowService: FlowService;
  private categoryValue: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  categories() {
    this.categoryValue = !this.categoryValue;
    this.flowService.setShowCategories(this.categoryValue);
  }

}
