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
    });

    if(this.passedData) {
      this.searchToday = this.passedData
    } else {
      this.searchToday = this.getTodayDate();
    }

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
      console.log("it is a saturday!");
      var yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      today = yesterday;
    } else if (today.getDay() === 0) {
      var yesterday = new Date();
      yesterday.setDate(today.getDate() - 2);
      today = yesterday;
    }

    // format dates to search database and display on page
    this.todayDisplay = month + ' ' + dd + ', ' + yyyy;
    return this.jokeService.formatDate(today);
}

private addZero(value: Number) {
  let paddedValue;
  if (value < 10) {
    paddedValue = '0' + value;
  } else {
    paddedValue = value;
  }
  return paddedValue;
}
  
private loadDailyJoke(searchDate: string) {

    //get joke object and bind
    this.jokeService.getDailyJoke(searchDate).subscribe(data => {
      if (data.$value === null) {
        this.jokeFlag = true;
      }
     
      this.jokeToday = data;
    
      if (this.jokeToday.hasAsset == true) {
        this.assetHandler();
      }
    });

    //get ratings for this joke
    this.jokeRatings = this._af.database.list('/ratings/' + searchDate);

  }

  private assetHandler() {
      this.assets = [];
      console.log("in asset handler");
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
