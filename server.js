var express = require('express');
var app = express();

/* mailgun dependencies & init */
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

/* sandbox credentials: 
const auth = {
  auth: {
    api_key: 'key-aa1fecf5c0fa298f77f60b63b76a9768',
    domain: 'sandboxd7ba3dbd75e8434990cdd9d7e7346e96.mailgun.org'
  }
}*/

/* mailgun heroku credentials */
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth));
/* end mailgun dependencies & init */

const forceSSL = function() {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    }
}
const api = require('./server/api');

app.use(forceSSL());
app.use(express.static(__dirname + '/dist'));
app.use('api', api);

console.log('sending mail');

nodemailerMailgun.sendMail({
    from: 'kieserman.julia@gmail.com',
    to: 'kieserman.julia@gmail.com',
    subject: 'test nodemailer',
    text: 'test works!'
}, function(err, info) {
    if (err) {
        console.log('Error: ' + err);
    } else {
        console.log('Response: ' + info);
    }
});

//let angular handle the routing
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 8080, function() {
    console.log('listening');
});