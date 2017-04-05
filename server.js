var express = require('express');
var app = express();
var cron = require('node-cron');

/* server set-up */
const api = require('./server/api');

app.use(express.static(__dirname + '/dist'));
app.use('api', api);
/* end server set-up */

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
var db = admin.database();
var serviceAccount = require('./server/serviceAccount.json');
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

cron.schedule('* * 18 * *', function() {

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
}); //end cron schedule


//let angular handle the routing
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 8080, function() {
    console.log('listening');
});