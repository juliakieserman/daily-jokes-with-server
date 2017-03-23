import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { SubscriptionObj } from '../../models/subscription-model';

@Injectable()
export class EmailService {

  private _af;

  constructor(af: AngularFire) { 
    this._af = af;
  }

  public addEmail(email: SubscriptionObj, hash: any) {
    const databaseObj = this._af.database.object('/emails');
    databaseObj.update({ [hash]: email });
  }

}
