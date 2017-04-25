import { Injectable } from '@angular/core';

@Injectable()
export class FlowService {

  private showCategories: boolean = false;

  constructor() { }


  getShowCategories() {
    return this.showCategories;
  }

  setShowCategories(value: boolean) {
    this.showCategories = value;
  }
}
