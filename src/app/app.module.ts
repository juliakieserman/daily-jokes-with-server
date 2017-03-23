/* external modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { ClarityModule } from 'clarity-angular';

/* ng components */
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { SubscriptionPageComponent } from './subscription-page/subscription-page.component';
import { JokesArchivePageComponent } from './jokes-archive-page/jokes-archive-page.component';
import { CreateJokePageComponent } from './create-joke-page/create-joke-page.component';

import { NgDropFilesDirective } from './directives/ng-drop-files-directive';


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
    CreateJokePageComponent,
    NgDropFilesDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ClarityModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
