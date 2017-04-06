import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { Md5 } from 'ts-md5/dist/md5';
import { EmailService } from '../services/email/email.service';
import { SubscriptionObj } from '../models/subscription-model';


@Component({
  selector: 'app-subscription-page',
  templateUrl: './subscription-page.component.html',
  styleUrls: ['./subscription-page.component.css'],
  providers: [EmailService]
})
export class SubscriptionPageComponent implements OnInit {

  private _af: AngularFire;
  private changeSubscription: SubscriptionObj;

  constructor(
    af: AngularFire,
    private router: Router,
    private emailService: EmailService,
  ) { 
    this._af = af;
  }

  ngOnInit() {
    this.changeSubscription = new SubscriptionObj();
  }

  subscribe() {
    let hash = Md5.hashStr(this.changeSubscription.email);
    this.emailService.addEmail(this.changeSubscription, hash);
    this.router.navigate(['/home']);
  }

}
