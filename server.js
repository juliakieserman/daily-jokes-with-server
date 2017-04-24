var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const path = require('path');

/* mailgun dependencies & init */
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const auth = require('./config.json');

/* server set-up */
const api = require('./server/api');

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('api', api);
/* end server set-up */

app.post('/contact', function(req, res) {
  var transporter = nodemailer.createTransport(mg(auth));
  var message = {
    from: req.body.postVars.email,
    to: 'kieserman.julia@gmail.com',
    subject: req.body.postVars.name + ' sent jokeonme.com a message',
    text: req.body.postVars.message
  }
  transporter.sendMail(message, function(err, inf) {
    if (err) {
      console.log('Mailgun Error: ' + err);
    } else {
      console.log('Email Response: ' + info);
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var listener = app.listen(process.env.PORT || 8080, function() {
    console.log('Server started at http://localhost:' + listener.address().port);
});