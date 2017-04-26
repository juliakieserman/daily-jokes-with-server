const MONTH_OBJ = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/* mailgun dependencies & init */
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

/* UNCOMMENT TO RUN LOCALLY */
//const auth = require('./mailgunSecrets.json');
const auth = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
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

/* UNCOMMENT TO RUN LOCALLY */
//var serviceAccount = require('./serviceAccount.json');

var serviceAccount = 
{
  type: process.env.SERVICE_ACCOUNT_TYPE,
  project_id: process.env.SERVICE_ACCOUNT_PROJECT_ID,
  private_key_id: process.env.SERVICE_ACCOUNT_PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
  client_id: process.env.SERVICE_ACCOUNT_CLIENT_ID,
  auth_uri: process.env.SERVICE_ACCOUNT_AUTH_URI,
  token_uri: process.env.SERVICE_ACCOUNT_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SERVICE_ACCOUNT_AUTH_PROVIDER_x509_CERT_URL,
  client_x509_cert_url: process.env.SERVICE_ACCOUNT_CLIENT_x509_CERT_URL
}

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

prettifyDate = function(dateStr) {
    var date = new Date(dateStr);
    var dd = date.getDate();
    var mm = date.getMonth();
    var yyyy = date.getFullYear();
    var month = MONTH_OBJ[mm-1];
    return month + ' ' + dd + ', ' + yyyy;  
}
/* End functions to format today's date */


const dateRef = getDate();
var dailyJoke;
var dailyUsers = [];
db.ref('/jokes/' + dateRef).once('value').then(function(snapshot) {
    dailyJoke = snapshot.val();
    dailyJoke.date = prettifyDate(dailyJoke.date);

    db.ref('/emails').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.val()['subscriptionType'] == 'Daily') {
                dailyUsers.push(childSnapshot.val()['email']);
            }
        });

        dailyEmail.render(dailyJoke, function(err, results) {
            if (err) {
                console.log('err creating email template, ' + err);
            } else {
             message = {
                from: 'kieserman.julia@gmail.com',
                to: dailyUsers,
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
    });
    
}, function(error) {
    console.log('Promise rejected');
    console.log(error);
}); //end joke retrieval