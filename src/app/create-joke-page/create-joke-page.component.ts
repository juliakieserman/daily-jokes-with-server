import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
import { JokeObj } from '../models/joke-model';
import { AssetObj } from '../models/asset-model';
import { JokeService } from '../services/jokes/joke.service';
import { AssetService } from '../services/assets/asset.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-joke-page',
  templateUrl: './create-joke-page.component.html',
  styleUrls: ['./create-joke-page.component.css'],
  providers: [JokeService, AssetService]
})

export class CreateJokePageComponent implements OnInit {

  private description: string;
  private jokes: FirebaseListObservable<any[]>;
  private newJoke: JokeObj;
  private isAuthorized: boolean = false;
  private isUser: boolean = false;
  private showError: boolean = false;

  /* summary variables */
  private reference1: string;
  private description1: string;
  private reference2: string;
  private description2: string;
  private reference3: string;
  private description3: string;
  private reference4: string;
  private description4: string;
  private reference5: string;
  private description5: string;


  //file upload variables
  isDropZoneOver: boolean = false;
  isEnabledUpload: boolean = true;
  files: Array<AssetObj[]> = [];

  constructor(
    private af: AngularFire, 
    private router: Router, 
    private jokeService: JokeService,
    private assetService: AssetService) { 
      this.af.auth.subscribe(auth => {
        //someone is logged in
        if (auth) {
          this.isUser = true;
          this.isAuthorized = this.checkValidLogin(auth);
        }
      })
  }

  private checkValidLogin(auth) {
    //hard coded for my email
    if (auth.uid === 'kJWBwwXK5qOxGfIuym3fRgBXCOc2') {
      return true;
    }
    
    return false;
  }

  loginGoogle() {
    this.af.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup,
    }).then(
      (success) => {
        this.isUser = true;
        this.isAuthorized = this.checkValidLogin(success);
      }).catch(
        (err) => {
          console.log('maybe some error handling goes here');
      })
  }

  logout() {
    this.af.auth.logout();
    this.router.navigateByUrl('/home');
  }

  ngOnInit() {
    this.newJoke = new JokeObj();
  }

  /* Start file upload functions */
  public fileOverDropZone(e: any) {
    this.isDropZoneOver = e;
  }

  uploadImagesToFirebase() {
    this.newJoke.hasAsset = true;
    this.isEnabledUpload = false;
    this.addFileNames();
    this.assetService.uploadImagesToFirebase(this.files);
  }

  clearFiles() {
    this.files = [];
    this.isEnabledUpload = true;
  }
  /* End file upload functions */

  private addFileNames() {
    this.newJoke.assets = [];
    _.each(this.files, (item: AssetObj) => {
      this.newJoke.assets.push(item.file.name);
    });
  }

  private addJokeToDB() {
    this.newJoke.description = this.newJoke.description.replace(/\n/g, "<br />");

    this.jokeService.addJoke(this.newJoke);
    this.logout();
  }

  private addSummaryToDB() {
    //begin constructing summary object
    let summary = {
      day1: {
        "jokeTitle": '',
        "date": '',
        "reference" : this.reference1,
        "description" : this.description1
      },
      day2: {
        "jokeTitle": '',
        "date": '',
        "reference" : this.reference2,
        "description" : this.description2
      },
      day3: {
        "jokeTitle": '',
        "date": '',
        "reference" : this.reference3,
        "description" : this.description3
      },
      day4: {
        "jokeTitle": '',
        "date": '',
        "reference" : this.reference4,
        "description" : this.description4
      },
      day5: {
        "jokeTitle": '',
        "date": '',
        "reference" : this.reference5,
        "description" : this.description5
      }};

      this.jokeService.addWeeklySummary(summary);
  }

}