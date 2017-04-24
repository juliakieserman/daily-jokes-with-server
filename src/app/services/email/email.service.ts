import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { SubscriptionObj } from '../../models/subscription-model';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EmailService {

  private _af;
  private _http;

  constructor(af: AngularFire, http: Http) { 
    this._af = af;
    this._http = http;
  }

  public addEmail(email: SubscriptionObj, hash: any) {
    const databaseObj = this._af.database.object('/emails');
    databaseObj.update({ [hash]: email });
  }

  public sendMessage(name: string, value: string, message: string) {
    let url = "jokes-website.herokuapp.com/contact";
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    let postVars = {
      name: name,
      email: value,
      message: message
    };

    return this._http.post(url, { postVars }, options)
      .map(res => res.json());
  }

}
