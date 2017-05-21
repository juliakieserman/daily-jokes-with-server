import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FirebaseListObservable, AngularFire, FirebaseApp } from 'angularfire2';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { JokeObj } from '../models/joke-model';
import { RatingObj } from '../models/rating-model';
import { AssetService } from '../services/assets/asset.service';
import { JokeService } from '../services/jokes/joke.service';

const MONTH_OBJ = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less'],
  providers: [AssetService, JokeService]
})
export class HomePageComponent implements OnInit {

  private todayDisplay;
  private hasFuture: boolean = true;
  private todaySearch;
  private jokeToday: JokeObj;
  private jokeRatings: FirebaseListObservable<any>;
  private sub: any;
  private passedData: string;
  private searchToday: string;
  private jokeFlag: boolean = false;

  private load: boolean = false;

  private assets: string[];

  /* rating variables */
  public max: number = 5;
  public rate: number = 5;
  public isReadonly: boolean = false;
  public overStar: number;
  private submittedRating: boolean = false;

  private _af: AngularFire;
  private firebaseApp;

  constructor(
    private route: ActivatedRoute, 
    private af: AngularFire,
    private jokeService: JokeService,
    private assetService: AssetService,
    @Inject(FirebaseApp) firebaseApp: any) {
      this._af = af;
      this.firebaseApp = firebaseApp;
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.passedData = params['date'];
      this.passedData ? this.searchToday = this.passedData : this.searchToday = this.getTodayDate();
    });

    //load data
    this.loadDailyJoke(this.searchToday);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private getTodayDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var month = MONTH_OBJ[mm-1];
    var yyyy = today.getFullYear();

    //no jokes on saturdays
    if (today.getDay() === 6) {
      var yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      today = yesterday;
      this.hasFuture = false;
    } else if (today.getDay() === 0) {
      var yesterday = new Date();
      yesterday.setDate(today.getDate() - 2);
      today = yesterday;
      this.hasFuture = false;
    }

    // format dates to search database and display on page
    this.todayDisplay = month + ' ' + dd + ', ' + yyyy;
    return this.jokeService.formatDate(today);
}

private addZero(value: Number) {
  let paddedValue;
  value < 10 ? paddedValue = '0' + value : paddedValue = value;
  return paddedValue;
}
  
private loadDailyJoke(searchDate: string) {
    
    //get joke object and bind
    this.jokeService.getDailyJoke(searchDate).subscribe(data => {
      if (data.$value === null) {
        this.jokeFlag = true;
      }
     
      this.jokeToday = data;
      console.log("got new joke obj");
      console.log(this.jokeToday);

      var date = new Date();
      var today = this.jokeService.formatDate(date);

     if (today === this.jokeToday.date.toString()) {
       this.hasFuture = false;
     } else {
       this.hasFuture = true;
     }
    
      if (this.jokeToday.hasAsset == true) {
        this.assetHandler();
      }
    });

    //get ratings for this joke
    this.jokeRatings = this._af.database.list('/ratings/' + searchDate);

  }

  private assetHandler() {
      this.assets = [];
      for (var i=0; i < this.jokeToday.assets.length; i++) {
        let path = 'images/' + this.jokeToday.assets[i];
        let image: string;
        const storageRef = this.firebaseApp.storage().ref().child(path);
        storageRef.getDownloadURL().then(
            url => {
                image = url;
                this.assets.push(image);
            }
        )
      }
    
  }

  /* easily navigate jokes */
  private getPrevious() {
    var current = new Date(this.jokeToday.date);
    if (current.getDay() === 6)
    { current.setDate(current.getDate() - 1);
    } else if (current.getDay() === 0) {
      current.setDate(current.getDate() - 2);
    }

    this.loadDailyJoke(this.jokeService.formatDate(current));
  }

  private getNext() {
    var current = new Date(this.jokeToday.date);
    //sets to a day earlier 
    current.setDate(current.getDate() + 2);
    
    if (current.getDay() === 6)
    { current.setDate(current.getDate() + 2);
    } else if (current.getDay() === 0) {
      current.setDate(current.getDate() + 1);
    }

    this.loadDailyJoke(this.jokeService.formatDate(current));
  }

  /* rating functions */
  public hoverOver(value: number) {
    this.overStar = value;
  };

  public resetStar() {
    this.overStar = void 0;
  }

  public submitRating() {
    //acknowledge submission to user
    this.submittedRating = true;
    this.isReadonly = true;

    this.jokeRatings.push(this.rate);
  }
}
