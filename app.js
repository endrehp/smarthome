var express = require('express');
var chalk = require('chalk'); // color console meassage
var debug = require('debug')('app'); // debug only writes error messages to the console when in debug mode
var morgan = require('morgan'); 
var path = require('path');

var app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/'))); // include static files
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));


app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.get('/colorChange', function(req, res){

    // Change color of phue
    
    
})

app.listen(3000, function() {
    debug(`Listening on port ${chalk.green("3000")}`);
});