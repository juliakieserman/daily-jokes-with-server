
/* mailgun dependencies & init */
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: 'key-aa1fecf5c0fa298f77f60b63b76a9768',
    domain: 'www.jokeonme.com'
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));
/* end mailgun dependencies & init */

/* template dependencies & init */
const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;

var templateDir = path.join(__dirname, 'templates', 'daily-email');
var dailyEmail = new EmailTemplate(templateDir);
/* end template dependencies & init */

/* firebase dependencies & init */
var admin = require('firebase-admin');
var serviceAccount = require('./server/serviceAccount.json');
admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://jokes-website.firebaseio.com'
 });
 var db = admin.database();
/* end firebase dependencies & init */

/* Functions to format today's date */
getDate = function() {
  var date = new Date();
  return date.getFullYear() + '-' + this.addZero(date.getMonth()+1) + '-' + this.addZero(date.getDate());
}

addZero = function(value) {
  let paddedValue;
    if (value < 10) {
      paddedValue = '0' + value;
    } else {
      paddedValue = value;
    }
    return paddedValue
}
/* End functions to format today's date */


const dateRef = getDate();
var dailyJoke;
//get joke
db.ref('/jokes/' + dateRef).once('value').then(function(snapshot) {
    dailyJoke = snapshot.val();
    dailyEmail.render(dailyJoke, function(err, results) {
        if (err) {
            console.log('err creating email template, ' + err);
        } else {
            message = {
                from: 'kieserman.julia@gmail.com',
                to: 'kieserman.julia@gmail.com',
                subject: 'Joke of the Day: ' + dateRef,
                html: results.html,
                text: results.text
            };
            nodemailerMailgun.sendMail(message, function(err, info) {
                if (err) {
                    console.log('Mailgun Error: ' + err);
                } else {
                    console.log('Email Response: ' + info);
            }
            });
        }
    })
    
}, function(error) {
    console.log('Promise rejected');
    console.log(error);
}); //end joke retrieval