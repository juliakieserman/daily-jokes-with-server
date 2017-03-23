const express = require('express');
const app = express();

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

//let angular handle the routing
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 8080);