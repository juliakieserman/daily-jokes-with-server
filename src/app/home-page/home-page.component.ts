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
  styleUrls: ['./home-page.component.scss'],
  providers: [AssetService, JokeService]
})
export class HomePageComponent implements OnInit {
  private isWeekend: boolean = false; //true if it is a weekend
  private hasFuture: boolean = true; //true if there is a more recent joke
  private jokeToday: JokeObj; //joke to be displayed on page
  private jokeRatings: FirebaseListObservable<any>; //ratings
  private sub: any;
  passedData;
  private assets: string[];//holds assets for joke (if any)

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
    let jokeKey

    //if routed from archives site, there will be a passed paramter
    this.sub = this.route.params.subscribe(params => {
      console.log('there should be a passed parameter');
      console.log(params['date']);
      this.passedData = params['date'];
      this.passedData ? jokeKey = this.passedData : jokeKey = new Date();
    });

    if (this.passedData === undefined) {
        //if weekend, set joke to previous Friday
      if (new Date().getDay() === 6) {
        this.isWeekend = true;
        let jokeDay = new Date();
        jokeDay.setDate(jokeDay.getDate() - 1)
        jokeKey = jokeDay;
      } else if (new Date().getDay() === 0) {
        this.isWeekend = true;
        let jokeDay = new Date();
        jokeDay.setDate(jokeDay.getDate() - 2);
        jokeKey = jokeDay;
      }
    }
  

    //load data
    this.loadDailyJoke(jokeKey);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  private loadDailyJoke(jokeKey) {    
    if(this.passedData === undefined) {
      jokeKey = this.jokeService.formatDate(jokeKey);
    } 
    //get joke object and bind
    this.jokeService.getDailyJoke(jokeKey).subscribe(data => {
      this.jokeToday = data;

      let dateString = this.jokeService.formatDate(new Date());
      //does not have future joke if it is today or a friday
      dateString === this.jokeToday.date || this.isWeekend ? this.hasFuture = false : this.hasFuture = true;
      console.log('has future is');
      console.log(this.hasFuture);
    
      //load assets, if applicable
      if (this.jokeToday.hasAsset === true) {
        this.assetHandler();
      }
    });

    //get ratings for this joke
    this.jokeRatings = this._af.database.list('/ratings/' + jokeKey);

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
