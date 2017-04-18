var express = require('express');
var app = express();
const path = require('path');

/* server set-up */
const api = require('./server/api');

app.use(express.static(__dirname + '/dist'));
app.use('api', api);
/* end server set-up */

app.listen(process.env.PORT || 8080, function() {
    console.log('listening');
});