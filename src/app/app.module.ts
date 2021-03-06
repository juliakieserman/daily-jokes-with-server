/* external modules */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { ClarityModule } from 'clarity-angular';
import { RatingModule } from 'ng2-bootstrap/rating';
import { TooltipModule } from 'ng2-bootstrap/tooltip';

/* ng components */
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { SubscriptionPageComponent } from './subscription-page/subscription-page.component';
import { JokesArchivePageComponent } from './jokes-archive-page/jokes-archive-page.component';

/* directives */
import { NgDropFilesDirective } from './directives/ng-drop-files.directive';
import { CreateJokePageComponent } from './create-joke-page/create-joke-page.component';

/* services */
import { AssetService } from './services/assets/asset.service';
import { EmailService } from './services/email/email.service';
import { JokeService } from './services/jokes/joke.service';

import { ReversePipe } from './jokes-archive-page/array-reverse.pipe';

export const firebaseConfig = {
    apiKey: "AIzaSyAq3BR1axTBqeqdqHWbqF68bPShUOiML8Y",
    authDomain: "jokes-website.firebaseapp.com",
    databaseURL: "https://jokes-website.firebaseio.com",
    storageBucket: "jokes-website.appspot.com",
    messagingSenderId: "1016586563889"
};

const appRoutes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'about', component: AboutPageComponent },
  { path: 'home/:date', component: HomePageComponent },
  { path: 'subscriptions', component: SubscriptionPageComponent },
  { path: 'archives', component: JokesArchivePageComponent },
  { path: 'create', component: CreateJokePageComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    AboutPageComponent,
    SubscriptionPageComponent,
    JokesArchivePageComponent,
    NgDropFilesDirective,
    CreateJokePageComponent,
    ReversePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ClarityModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    RatingModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    AssetService, 
    JokeService,
    EmailService  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
