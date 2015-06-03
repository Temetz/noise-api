
var express         = require('express');
var shell           = require('shelljs');
var bodyParser      = require('body-parser');
var cookieParser    = require('cookie-parser');

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
}

// Constants
var PORT = 5300;

// App
var app = express();

app.use(bodyParser.json());
app.use(cookieParser('verysecurepassword'));
app.use(allowCrossDomain);

app.locals.limit = {
    loss: '',
    delay: '',
    delayvariance: ''
}

app.put('/limit', function (req, res) {
    var command = 'sudo tc qdisc change dev lo root netem ';
    /*When the user has NOT inputted any values to any of the fields in configure - index.jade
    let's assume that they want to clear their loss and delay, and reset the lingering variables*/
    if (req.body.loss == "" && req.body.delay == "" && req.body.delayvariance == "") {
        app.locals.limit.loss = '';
        app.locals.limit.delay = '';
        app.locals.limit.delayvariance = '';
    }
    /*Do not allow loss-values over 100% or under 0%*/
    if (req.body.loss != "" && req.body.loss >= 0 && req.body.loss <= 100) {
        app.locals.limit.loss = req.body.loss;
        command += 'loss ' + req.body.loss + '% ';
    }
    else if (app.locals.limit.loss != '') {
        command += 'loss ' + app.locals.limit.loss + '% ';
    }
    /*Do not allow negative delay values*/
    if (req.body.delay != "" && req.body.delay >= 0) {
        app.locals.limit.delay = req.body.delay;
        command += 'delay ' + req.body.delay + 'ms ';
    }
    else if (app.locals.limit.delay != '') {
        command += 'delay ' + app.locals.limit.delay + 'ms ';
    }
    /*Don't execute unless the user has inputted a value for delay*/
    if (req.body.delayvariance != "" && req.body.delay != "") {
        app.locals.limit.delayvariance = req.body.delayvariance;
        command += req.body.delayvariance + 'ms ';
    }
    else if (app.locals.limit.delayvariance != '') {
        command += app.locals.limit.delayvariance + 'ms ';
    }
    if(parseInt(req.body.jitter) === 1){
        command += 'distribution ' + req.body.distribution;
    }
    if (command != 'sudo tc qdisc change dev lo root netem ') {
        shell.exec(command, {silent:true});
    }
    var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
    res.json(status);
});

app.put('/target', function (req, res) {
    var command = undefined;
    
    command = "sudo sed -i '24s/.*/server target " + req.body.clienturl + "/' /etc/haproxy/haproxy.cfg";
    shell.exec(command, {silent:true});

    command = "sudo sed -i '27s/.*/server target " + req.body.apiurl + "/' /etc/haproxy/haproxy.cfg";
    shell.exec(command, {silent:true});

    command = "sudo sed -i '30s/.*/server target " + req.body.iourl + "/' /etc/haproxy/haproxy.cfg";
    shell.exec(command, {silent:true});

    var status = shell.exec('sudo service haproxy restart', {silent:true}).output;
    res.json(status);
});

app.get('/', function (req, res) {
    res.status(500);
});

app.listen(PORT);
console.log('Running on port:' + PORT);
