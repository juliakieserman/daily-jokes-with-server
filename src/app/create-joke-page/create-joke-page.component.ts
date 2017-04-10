import { Component, OnInit } from '@angular/core';
import { DatePickerOptions, DateModel } from 'ng2-datepicker';
import { AngularFire, FirebaseListObservable, FirebaseRef } from 'angularfire2';
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
  private date: DateModel;
  private options: DatePickerOptions;
  private jokes: FirebaseListObservable<any[]>;
  private newJoke: JokeObj;

  //file upload variables
  isDropZoneOver: boolean = false;
  isEnabledUpload: boolean = true;
  files: Array<AssetObj[]> = [];

  constructor(
    private af: AngularFire, 
    private router: Router, 
    private jokeService: JokeService,
    private assetService: AssetService) { 
    this.options = new DatePickerOptions();
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

  private addToDB() {
    this.newJoke.description = this.newJoke.description.replace(/\n/g, "<br />");

    this.jokeService.addJoke(this.newJoke);
    this.router.navigate(['/home']);
  }

}