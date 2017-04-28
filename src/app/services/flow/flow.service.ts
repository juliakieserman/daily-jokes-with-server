import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class FlowService {

  public sideNavToggle:EventEmitter<boolean> = new EventEmitter<boolean>();
  private toggle: boolean = false;

  constructor() { }

  setToggle(value) {
    this.toggle = value;
  }

  getToggle() {
    return this.toggle;
  }

}
