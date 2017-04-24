import { Component, OnInit } from '@angular/core';
import { trigger, state, style, keyframes, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { JokeService } from '../services/jokes/joke.service';
import { EmailService } from '../services/email/email.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.less'],
  animations: [
    trigger('flip', [
      transition('inactive => active', [
        animate(1000, keyframes([
          style({transform: 'perspective(400px) rotate3d(1, 0, 0, 90deg)', offset: .15}),
          style({transform: 'perspective(400px) rotate3d(1, 0, 0, -20deg)', offset: .40}),
          style({transform: 'perspective(400px) rotate3d(1, 0, 0, 10deg)', offset: .60}),
          style({transform: 'perspective(400px) rotate3d(1, 0, 0, -5deg)', offset: .80}),
          style({transform: 'perspective(400px)', offset: 1})
        ]))
      ])
    ])
  ],
  providers: [JokeService, EmailService]
})
export class AboutPageComponent implements OnInit {

  flipState: string = 'inactive';
  content: string = '?';
  reveal: string = 'click to reveal';
  jokeCount: number;

  //contact form variables
  showContact: boolean = false;
  submittedContact: boolean = false;
  emailName: string;
  emailMessage: string;
  emailValue: string;

  constructor(
    private jokeService: JokeService,
    private router: Router,
    private emailService: EmailService) {
   }

  ngOnInit() {
    this.getJokeCount();
  }

  toggleMove() {
    this.flipState = 'active';
    this.content = this.jokeCount.toString();
    this.reveal = 'days and counting';
  }

  private getJokeCount() {
    this.jokeService.getDailyJokeCount().subscribe(joke => {
      this.jokeCount = joke[0].count;
    }) 
  }

  private randomJoke() {
    let startDate = this.jokeService.getStartDate();
    const endDate = new Date();
    let randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    let param = this.jokeService.formatDate(randomDate);
    this.router.navigate(['/home', param]);
  }

  private contactMe() {
    this.showContact = true;
  }

  private submitContact() {
    this.showContact = false;
    this.submittedContact = true;
    this.emailService.sendMessage(this.emailName, this.emailValue, this.emailMessage);
  }

}
