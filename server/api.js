const express = require('express');
const router = express.Router();

/* mailgun dependencies & init */
const api_key = process.env.MAILGUN_API_KEY;
const domain = process.env.MAILGUN_DOMAIN;
const mailgun = require('mailgun-js') ({apiKey: api_key, domain: domain});
/* end mailgun dependencies & init */

/* template dependencies & init */
const path = require('path');
const EmailTemplate = require('email-templates').EmailTemplate;

var templateDir = path.join(__dirname, 'templates', 'daily-email');
var dailyEmail = new EmailTemplate(templateDir);
/* end template dependencies & init */

/* firebase dependencies & init */
var admin = require('firebase-admin');

var serviceAccount = require('./serviceAccount.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://jokes-website.firebaseio.com'
});
/* end firebase dependencies & init */

var db = admin.database();

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

/* function to send an email using gmail-send module */

/* monster cron job to send daily email */
/*var dailyJob = new CronJob({

  cronTime: '0 0 0 * * * ',
  //start onTick function
  onTick: function() {
    const dateRef = getDate();
    var dailyJokes;
    var emailUsers = [];

    // start get daily joke 
    var jokeRef = db.ref('/jokes/' + dateRef);
    jokeRef.once('value', function(snapshot) {
      dailyJoke = snapshot.val();

      //start get daily subscribers 
      var usersRef = db.ref('/emails');
      usersRef.once('value')
        .then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.val()['subscriptionType'] == 'Daily') {
              emailUsers.push(childSnapshot.val()['email']);
            }
          })

          //start generate email 
          dailyEmail.render(dailyJoke, function(err, results) {
            if (err) {
              console.log('err, ' + err);
            } else {
              var transporter, message;

              //start create and send email
              transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                  user: "postmaster@sandboxd7ba3dbd75e8434990cdd9d7e7346e96.mailgun.org",
                  pass: "dcf8a500df029a920bbdb2c84c5f63d2" // You set this.
                }
              });

              message = {
                from: 'kieserman.julia@gmail.com',
                to: 'kieserman.julia@gmail.com', //just testing - should be emailUsers
                subject: 'Joke of the Day: ' + dateRef,
                html: results.html,
                text: results.text
              };

              transporter.sendMail(message, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log('Sent: ' + info.response);
                }
              })
            }
            //end create and send mail
          })
          //end generate email

        })
        //end get daily subscribers
    })
    //end get daily joke
  },
  //end onTick function
   start: false

});
// End cron job*/

router.get('/', (req, res) => {
    console.log('api works');
});

router.get('/test', (req, res) => {
    var data = {
      from: 'kieserman.julia@gmail.com',
      to: 'kieserman.julia@gmail.com',
      subject: 'Hello',
      text: 'HELL YES IT WORKS'
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
});

/*router.get('/.well-known/acme-challenge/:content', function(req, res) {
  res.send('I0uVX9V-Uu86lhR-_h1ODrFe60SkSultJwwIRckHPVM.mjxrtlhmsvZj-0TFue5HiGZN6-fhOQKJCw5AEZTXfys');
});*/

module.exports = router;