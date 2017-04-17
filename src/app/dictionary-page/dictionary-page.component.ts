import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable, AngularFire } from 'angularfire2';
import { JokeObj } from '../models/joke-model';
import { DictObj } from '../models/dictionary-model';
import { JokeService } from '../services/jokes/joke.service';

@Component({
  selector: 'app-dictionary-page',
  templateUrl: './dictionary-page.component.html',
  styleUrls: ['./dictionary-page.component.css'],
  providers: [JokeService]
})
export class DictionaryPageComponent implements OnInit {

  private alphabet: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  private entries: FirebaseListObservable<any>;
  private _af: AngularFire;
  private letterSelect: Boolean = false;
  private dictObj: DictObj;

  constructor(af: AngularFire, private jokeService: JokeService) { 
    this._af = af;
  }

  ngOnInit() {
  }

  filterLetter(letter) {
    this.letterSelect = true;
    this.entries = this._af.database.list('/dictionary/' + letter);
    //get first object in list to be featured object
  }

  switchFeature(entry) {
    console.log("switch");
    console.log(entry);
  }

  

}
