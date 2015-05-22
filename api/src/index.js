
var express         = require('express');
var shell           = require('shelljs');
var path            = require("path");
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override')

// Constants
var PORT = 5300;

// App
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
require('jade-method-override').express(app)

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.put('/limit', function (req, res) {
    shell.exec('sudo tc qdisc change dev lo root netem loss '+
                            req.body.loss+'% delay '+req.body.delay+
                            'ms', {silent:true});
    var status = shell.exec('sudo tc qdisc show', {silent:true}).output;
    res.send('Status:' + status);
});

app.get('/', function (req, res) {
    res.render('welcome', {host:req.headers['host']});
});

app.get('/configure', function (req, res) {
    res.render('configure');
});

app.listen(PORT);
console.log('Running on http://localhost:' + PORT);
