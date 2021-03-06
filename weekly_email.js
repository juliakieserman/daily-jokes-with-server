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

var templateDir = path.join(__dirname, 'templates', 'weekly-email');
var weeklyEmail = new EmailTemplate(templateDir);
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

var weeklySummary;
var weeklyUsers = [];
//get last week's jokes
db.ref('/weeklysummary').limitToLast(1).once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        weeklySummary = childSnapshot.val();
    });

    //get weekly email users
    db.ref('/emails').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.val()['subscriptionType'] == 'Weekly') {
                weeklyUsers.push(childSnapshot.val()['email']);
            }
        });
        weeklyEmail.render(weeklySummary, function(err, results) {
            if (err) {
                console.log('err creating email template, ' + err);
            } else {
                message = {
                    from: 'kieserman.julia@gmail.com',
                    to: 'jbk67@georgetown.edu',
                    subject: 'Your Week in Jokes',
                    html: results.html,
                    text: results.txt
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

});