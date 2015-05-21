var express = require('express');
var shell = require('shelljs');

// Constants
var PORT = 5300;

// App
var app = express();
app.use(require('body-parser')());
app.put('/limit', function (req, res) {
    shell.exec('sudo tc qdisc change dev lo root netem loss '+
                            req.body.loss+'% delay '+req.body.delay+
                            'ms', {silent:true}).output;

    var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
    res.send('Status:' + status);
});

app.get('/', function (req, res) {
    console.log('shelsl');
    res.send('Hello! This is root.');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
