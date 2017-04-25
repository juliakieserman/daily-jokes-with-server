import { Component, OnInit, ElementRef } from '@angular/core';
import { trigger, state, style, keyframes, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { JokeObj } from '../models/joke-model';
import { JokeService } from '../services/jokes/joke.service';

@Component({
  selector: 'app-jokes-archive-page',
  templateUrl: './jokes-archive-page.component.html',
  styleUrls: ['./jokes-archive-page.component.css'],
  animations: [
    trigger('shake', [
      transition('inactive => active', [
        animate(1000, keyframes([
          style({transform: 'translate3d(-1px, 0, 0)', offset: .1}),
          style({transform: 'translate3d(2px, 0, 0)', offset: .2}),
          style({transform: 'translate3d(-4px, 0, 0)', offset: .3}),
          style({transform: 'translate3d(4px, 0, 0)', offset: .4})
        ]))
      ])
    ])
  ]
})
export class JokesArchivePageComponent implements OnInit {

  private jokeList: JokeObj[];
  private _af: AngularFire;
  public searchList: JokeObj[] = [];
  private elementRef;
  private searchText = '';
  private titles: JokeObj[] = [];

  private shakeState: string = 'inactive';

  constructor(af: AngularFire, private router: Router, private element: ElementRef) {
    this._af = af;
    this.elementRef = element;
  }

  ngOnInit() {
    this.jokeList = [];
    this.loadData();
  }

  toggleShake() {
    if (this.shakeState == 'active') {
      console.log('setting to inactive');
      this.shakeState = 'inactive';
    } else {
      console.log('setting to active');
      this.shakeState = 'active';
    }
  }

  private loadData() {
    this._af.database.list('/jokes').subscribe(jokes => {
      jokes.forEach(joke => {
        this.jokeList.push(joke);
        this.titles.push(joke.title);
      });
    });
  }

  private goToJoke(item: JokeObj) {
    this.router.navigate(['/home', item.date]);
  }

  private filterSearch() {
    
    if (this.searchText !== '') {
      const text = this.searchText;
      this.searchList = this.jokeList.filter(function(el) {
        
        return el.title.toLowerCase().indexOf(text.toLowerCase()) > -1;
      });
    } else {
      this.searchList = [];
    }
  }

}
