import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { JokeObj } from '../models/joke-model';

@Component({
  selector: 'app-jokes-archive-page',
  templateUrl: './jokes-archive-page.component.html',
  styleUrls: ['./jokes-archive-page.component.css']
})
export class JokesArchivePageComponent implements OnInit {

  private jokes: FirebaseListObservable<any>;
  private _af: AngularFire;

  constructor(af: AngularFire, private router: Router) {
    this._af = af;
  }

  ngOnInit() {
    //TO-DO: modify to get through service
    this.jokes = this._af.database.list('/jokes');
  }

  private goToJoke(item: JokeObj) {
    this.router.navigate(['/home', item.date]);
  }

}
