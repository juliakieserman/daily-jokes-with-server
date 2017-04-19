import { Injectable } from '@angular/core';
import { JokeObj } from '../../models/joke-model';
import { AngularFire, FirebaseListObservable, FirebaseRef, FirebaseObjectObservable } from 'angularfire2';

/* constants for date calculations */
const MONTH_OBJ = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const FIVE = 5;
const START_TIME = new Date('February 15, 2017 5:08:00');
const DAY_IN_MILLISECONDS = 1000*60*60*24;
const DAYS_IN_WEEK = 7;
const WEEKS_IN_MONTH = 4;

@Injectable()
export class JokeService {

  private _af;

  constructor(af: AngularFire) {
    this._af = af;
  }

  /* functions to get data from firebase */
  public getJokes() {
    return this._af.database.list('/jokes');
  }

  public getDailyJoke(today: String) {
    return this._af.database.object('/jokes/' + today);
  }

  public getDailyJokeCount() {
    return  this._af.database.list('/jokes', {
      query: {
        limitToLast: 1
      }
    })
  }

  /* functions to send data to firebase */
  public submitRating(today: Date, updatedArray: number[]) {
    const jokesObservable = this.getDailyJoke(today.toString());
    jokesObservable.set({ ratings: updatedArray});
  }

  public addJoke(jokeObj: JokeObj) {
    const date = jokeObj.date.toString();
    const databaseObj = this._af.database.object('/jokes');
    databaseObj.update({ [date]: jokeObj});
  }

  /* functions to calculate duration */
  public calcDateDiff() {
    let today = new Date();
    let todayTime = today.getTime();
    let startTime = START_TIME.getTime();

    let diff = Math.abs(todayTime - startTime);
    return Math.round(diff/DAY_IN_MILLISECONDS);
  }

  public calcWeekDiff() {
    let days = this.calcDateDiff();
    return Math.round(days/DAYS_IN_WEEK);
  }

  public calcMonthDiff() {
    let weeks = this.calcMonthDiff();
    return Math.round(weeks/WEEKS_IN_MONTH);
  }

  /* functions to calculate or format dates */
  public getStartDate() {
    return START_TIME;
  }

  public formatDate(date: Date) {
    return date.getFullYear() + '-' + this.addZero(date.getMonth()+1) + '-' + this.addZero(date.getDate());
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

  addWeeklySummary(weeklyObj) {
    //get last 5 jokes from database
    const databaseObj = this._af.database.object('/weeklysummary');
    let weekOf;
    let iterator = 1;
    const weekOfJokes = this._af.database.list('/jokes', {
      query: {
        limitToLast: 5
      }
    }).subscribe(jokes => {
      jokes.forEach(joke => {
        if (iterator == 1) {
          weekOf = joke.date;
        }
        const accessor = 'day' + iterator;
        weeklyObj[accessor].jokeTitle = joke.title;
        weeklyObj[accessor].date = joke.date;
        iterator++;
      });
      databaseObj.update({ [weekOf]: weeklyObj});
    });
  }

}
