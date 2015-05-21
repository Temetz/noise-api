var express = require('express');
var shell = require('shelljs');

// Constants
var PORT = 5300;

// App
var app = express();
app.get('/node', function (req, res) {
    var version = exec('node --version', {silent:true}).output;
    res.send(version);
});

app.get('/', function (req, res) {
    res.send('Hello! This is root');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
