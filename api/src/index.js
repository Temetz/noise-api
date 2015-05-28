
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
app.all('*', checkUser);

function checkUser(req, res, next) {
if(req.method == "OPTIONS"){
    next();
}
  if(req.headers.authorization == process.env.APIKEY){
        next();
    }
    else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}

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
    var command = "sudo sed -i '32s/.*/server target " + req.body.httptarget + "/' /etc/haproxy/haproxy.cfg";
    shell.exec(command, {silent:true});
    var status = shell.exec('sudo service haproxy restart', {silent:true}).output;
    res.json(status);
});

app.get('/', function (req, res) {
    res.redirect(301, 'http://management.noise.n4sjamk.org');
});

app.listen(PORT);
console.log('Running on port:' + PORT);
