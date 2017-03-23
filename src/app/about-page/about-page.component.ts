import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JokeService } from '../services/jokes/joke.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrls: ['./about-page.component.css'],
  providers: [JokeService]
})
export class AboutPageComponent implements OnInit {

  constructor(
    private jokeService: JokeService,
    private router: Router) {
    
   }

  ngOnInit() {
  }

  private randomJoke() {
    let startDate = this.jokeService.getStartDate();
    const endDate = new Date();
    let randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    let param = this.jokeService.formatDate(randomDate);
    this.router.navigate(['/home', param]);
  }

}
