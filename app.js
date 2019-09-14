var express = require('express');
var chalk = require('chalk'); // color console meassage
var debug = require('debug')('app'); // debug only writes error messages to the console when in debug mode
var morgan = require('morgan');
var path = require('path');
var url = require('url');

var Hue = require('philips-hue');

var app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/'))); // include static files
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));


app.get('/', function (req, res) {

    setLights(2237, 40, 185);

    res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.get('/colorChange', function (req, res) {

    // Change color of phue
    //setLights(50000, 200, 90);

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query);
    setLights(query.hue, 200, 90);
})

app.get('/bright', function (req, res) {

    setLights(2237, 40, 185);
})

app.listen(3000, function () {
    debug(`Listening on port ${chalk.green("3000")}`);
});

function setLights(hueVal, satVal, briVal) {

    var hue = new Hue;
    hue.bridge = "192.168.0.23";  // from hue.getBridges
    hue.username = "nF0hElD3YBelZfqsbpfWouMZryQraKnNKFFjjvoG"; // from hue.auth
    hue.light(4).setState({ hue: hueVal, sat: satVal, bri: briVal });
    hue.light(6).setState({ hue: hueVal, sat: satVal, bri: briVal });
    hue.light(7).setState({ hue: hueVal, sat: satVal, bri: briVal });
    hue.light(8).setState({ hue: hueVal, sat: satVal, bri: briVal });
    hue.light(9).setState({ hue: hueVal, sat: satVal, bri: briVal });

}