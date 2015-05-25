
var express         = require('express');
var shell           = require('shelljs');
var path            = require("path");
var bodyParser      = require('body-parser');

// Constants
var PORT = 5300;

// App
var app = express();

app.use(bodyParser.json());
app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.put('/limit', function (req, res) {
    var command = 'sudo tc qdisc change dev lo root netem ';
    command += 'loss ' + req.body.loss + '% ';
    command += 'delay ' + req.body.delay + 'ms ';
    command += req.body.delayvariance + 'ms ';
    if(req.body.jitter === 1){
        command += 'distribution ' + req.body.distribution;

    }
    shell.exec(command, {silent:true});
    var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
    res.json(status);
});

app.put('/target', function (req, res) {
    var command = "sudo sed -i '35s/.*/server target " + req.body.httptarget + ":80/' /etc/haproxy/haproxy.cfg";
    shell.exec(command, {silent:true});
    var status = shell.exec('sudo service haproxy restart', {silent:true}).output;
    res.json(status);
});

app.get('/', function (req, res) {
    res.redirect('/gui/welcome');
});

app.get('/gui/welcome', function (req, res) {
    res.render('welcome', {host:req.headers['host']});
});

app.get('/gui/configure', function (req, res) {
    res.render('configure');
});

app.get('/gui/target', function (req, res) {
    res.render('target');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
