import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { JokeObj } from '../models/joke-model';

@Component({
  selector: 'app-dictionary-page',
  templateUrl: './dictionary-page.component.html',
  styleUrls: ['./dictionary-page.component.css']
})
export class DictionaryPageComponent implements OnInit {

  private alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  private entries: FirebaseListObservable<any>;
  private _af: AngularFire;

  constructor(af: AngularFire) { 
    this._af = af;
  }

  ngOnInit() {
    /*this.entries = this._af.database.list('/jokes', {
      query: {
        orderByChild: 'dictFlag',
        equalTo: 'true'
      }
    });*/
  }

  filterLetter(letter) {
    console.log("this is it");
    console.log(letter);
  }

  

}
