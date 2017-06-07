import { Component, OnInit } from '@angular/core';
import { AngularFire, AngularFireDatabase, FirebaseListObservable, AuthProviders, AuthMethods } from 'angularfire2';
import { Router } from '@angular/router';
import { JokeObj } from '../models/joke-model';
import { AssetObj } from '../models/asset-model';
import { JokeService } from '../services/jokes/joke.service';
import { AssetService } from '../services/assets/asset.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-create-joke-page',
  templateUrl: './create-joke-page.component.html',
  styleUrls: ['./create-joke-page.component.scss'],
  providers: [JokeService, AssetService]
})

export class CreateJokePageComponent implements OnInit {

  create: boolean = false;
  edit: boolean = false; //true if choose to edit a joke
  editing: boolean = false; //true if currently editing a selected joke
  activeJoke: JokeObj;

  //authorization variables 
  isAuthorized: boolean = false;
  isUser: boolean = false;

  jokeList: FirebaseListObservable<any>;

  //file upload variables
  isDropZoneOver: boolean = false;
  isEnabledUpload: boolean = true;
  files: Array<AssetObj[]> = [];

  constructor(
    private _af: AngularFire, 
    private router: Router, 
    private jokeService: JokeService,
    private assetService: AssetService,
    private db: AngularFireDatabase) { 
      this.jokeList = db.list('/jokes');
      this._af.auth.subscribe(auth => {
        //someone is logged in
        if (auth) {
          this.isUser = true;
          this.isAuthorized = this.checkValidLogin(auth);
        }
      })
  }

  ngOnInit() {
    this.activeJoke = new JokeObj();
  }

  back() {
    this.activeJoke = new JokeObj();
    this.edit = false;
    this.create = false;
    this.editing = false;
  }

  updateAction(action) {
    if (action === 'edit') {
      this.edit = true;
    } else {
      this.create = true;
    }
  }

  selectToEdit(joke) {
    this.activeJoke = joke;
    this.editing = true;
  }

  saveChanges() {
    const databaseObj = this._af.database.object('/jokes');
    const keyValue = this.activeJoke.date;
    databaseObj.update({ [keyValue]: this.activeJoke });
    this.editing = false;
    this.edit = false;
  }
  
  /* AUTHENTICATION FUNCTIONS */
  private checkValidLogin(auth) {
    //hard coded for my email
    if (auth.uid === 'kJWBwwXK5qOxGfIuym3fRgBXCOc2') {
      return true;
    }
    
    return false;
  }

  loginGoogle() {
    this._af.auth.login({
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
    this._af.auth.logout();
    this.router.navigateByUrl('/home');
  }

  /* Start file upload functions */
  public fileOverDropZone(e: any) {
    this.isDropZoneOver = e;
  }

  uploadImagesToFirebase() {
    this.activeJoke.hasAsset = true;
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
    this.activeJoke.assets = [];
    _.each(this.files, (item: AssetObj) => {
      this.activeJoke.assets.push(item.file.name);
    });
  }

  private addJokeToDB() {
    this.activeJoke.description = this.activeJoke.description.replace(/\n/g, "<br />");

    this.jokeService.addJoke(this.activeJoke);
    this.create = false;
  }
}