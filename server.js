var express = require('express');
var app = express();
const path = require('path');

/* server set-up */
const api = require('./server/api');

app.use(express.static(__dirname + '/dist'));
app.use('api', api);
/* end server set-up */

app.post('/contact', function(req, res) {
  console.log("caught it");
  console.log(req.body);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var listener = app.listen(process.env.PORT || 8080, function() {
    console.log('Server started at http://localhost:' + listener.address().port);
});