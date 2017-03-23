const express = require('express');
const router = express.Router();

/* email dependencies & init */
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const cron = require('node-cron');


const auth = {
    auth: {
        api_key: "key-aa1fecf5c0fa298f77f60b63b76a9768",
        domain: "sandboxd7ba3dbd75e8434990cdd9d7e7346e96.mailgun.org"
    }
}

/* template dependencies & init */
const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;

var templateDir = path.join(__dirname, 'templates', 'daily-email');
var dailyEmail = new EmailTemplate(templateDir);

/* firebase dependencies & init */
/*var admin = require('firebase-admin');
//var firebase = require('firebase');
//import * as admin from 'firebase-admin';

var serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://jokes-website.firebaseio.com'
});

var db = admin.database();*/


/*var config = {
    apiKey: "AIzaSyAq3BR1axTBqeqdqHWbqF68bPShUOiML8Y",
    authDomain: "jokes-website.firebaseapp.com",
    databaseURL: "https://jokes-website.firebaseio.com",
    storageBucket: "jokes-website.appspot.com",
    messagingSenderId: "1016586563889"
  };
firebase.initializeApp(config);*/

cron.schedule('* * * * *', function() {
  console.log("triggered");
  //dummy data
const user = {name: 'Joe', pasta: 'Spaghetti'};
dailyEmail.render(user, function(err, results) {
  if (err) {
    return console.log(err);
  } else {
var transporter
    , message;

  transporter = nodemailer.createTransport({
    service: 'Mailgun',
    auth: {
      user: "postmaster@sandboxd7ba3dbd75e8434990cdd9d7e7346e96.mailgun.org",
      pass: "dcf8a500df029a920bbdb2c84c5f63d2" // You set this.
    }
  });
  message = {
    from: 'kieserman.julia@gmail.com',
    to: 'kieserman.julia@gmail.com', // comma separated list
    subject: 'Subject Line',
    html: results.html,
    text: results.text
  };
  transporter.sendMail(message, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Sent: ' + info.response);
    }
  });
  }

});

    /*console.log("starting!");
    var ref = db.ref('/emails');
ref.once("value", function(snapshot) {
    console.log("in here");
    console.log(snapshot.val());*/
    
});