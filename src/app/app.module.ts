import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { ClarityModule } from 'clarity-angular';

import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';

export const firebaseConfig = {
    apiKey: "AIzaSyAq3BR1axTBqeqdqHWbqF68bPShUOiML8Y",
    authDomain: "jokes-website.firebaseapp.com",
    databaseURL: "https://jokes-website.firebaseio.com",
    storageBucket: "jokes-website.appspot.com",
    messagingSenderId: "1016586563889"
};

const appRoutes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
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
