import { Injectable, Inject } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import { AssetObj } from '../../models/asset-model';
import * as firebase from 'firebase';
import * as _ from 'lodash';

@Injectable()
export class AssetService {
    private _af;
    private firebaseApp;
    private assets: FirebaseObjectObservable<any[]>;
    private IMAGES_FOLDER: string = 'images/';

    constructor(af: AngularFire, @Inject(FirebaseApp) firebaseApp: any) {
        this._af = af;
        this.firebaseApp = firebaseApp;
    }

    public uploadImagesToFirebase(files: Array<AssetObj[]>) {
        let storageRef = firebase.storage().ref();
        _.each(files, (item:AssetObj) => {
            item.isUploading = true;
            let uploadTask: firebase.storage.UploadTask = storageRef.child('images/' + item.file.name).put(item.file);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, 
            (snapshot) => item.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            (err0r) => {},
            () => {
                item.url = uploadTask.snapshot.downloadURL;
                item.isUploading = false;
                this.saveAsset({ name: item.file.name, url: item.url });
            });
        });

    }

    /* TO-DO: figure out how to work this with observables and move functionality into service */
    public getAsset(title: string) {
        const path = this.IMAGES_FOLDER + title;
        let image: string;
        const storageRef = this.firebaseApp.storage().ref().child(path);
        storageRef.getDownloadURL().then(
            url => {
                image = url;
                return image;
            }
        )
    }

    private saveAsset(image: any) {
        this._af.database.list('/images').push(image);
    }

}