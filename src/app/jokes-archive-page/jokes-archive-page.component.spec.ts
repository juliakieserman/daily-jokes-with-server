/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JokesArchivePageComponent } from './jokes-archive-page.component';

describe('JokesArchivePageComponent', () => {
  let component: JokesArchivePageComponent;
  let fixture: ComponentFixture<JokesArchivePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JokesArchivePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JokesArchivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
