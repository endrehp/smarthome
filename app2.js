const express = require('express');
const chalk = require('chalk'); // color console meassage
const debug = require('debug')('app'); // debug only writes error messages to the console when in debug mode
const morgan = require('morgan');
const path = require('path');
const url = require('url');
const sql = require('mysql');
const Hue = require('philips-hue');
const pool = require('./src/datasource/database');
var bodyParser = require('body-parser')

const app = express();

let globalMessage = "Initial";
let sseRes; 


pool.query('SELECT * FROM modes', (err, results, fields) => {
    if (err) throw new Error(err);
    debug(results);
})

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public/'))); // include static files
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json())


const nav = [{ link: '/modes', title: 'Modes' },
  { link: '/devices', title: 'Devices' }
];

const modeRouter = require('./src/routes/modeRoutes')(nav);
const databaseRouter = require('./src/routes/databaseRoutes')();
const deviceRouter = require('./src/routes/deviceRoutes')(nav);
//const lightApi = require('./src/routes/lightApi');


app.use('/modes', modeRouter);
app.use('/devices', deviceRouter);
app.use('/database', databaseRouter);
app.get('/', (req, res) => {

    globalMessage = "Index opened";
    let messageId = 1;
    if (sseRes) {
        sseRes.write(`id: ${messageId}\n`);
        sseRes.write(`data: Someone opened index\n\n`);
    }

    res.render(
        'index',
        {
            nav,
            title: 'Home'
        }
    );
});

app.get('/colorChange', function (req, res) {

    // Change color of phue
    //setLights(50000, 200, 90);

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    console.log(query);
    //setLights(query.hue, 200, 90);
})

app.get('/bright', function (req, res) {

    setLights(2237, 40, 185);
})

app.get('/sse', (req, res) => {

    res.render(
        'sseClient'
        );

});

app.get('/messageWriter', (req, res) => {

    res.render('messageWriter');

});

app.post('/messageWriter', (req, res) => {

    let message = req.body.message;
    console.log(message);
    if (sseRes) {
        sseResponse(sseRes, message);
    }

    res.json(JSON.stringify({result: 'success', modeID}));

});

function sseDemo(req, res) {
    let messageId = 0;

    const intervalId = setInterval(() => {
        res.write(`id: ${messageId}\n`);
        res.write(`data: Test Message -- ${globalMessage}\n\n`);
        messageId += 1;
    }, 1000);

    req.on('close', () => {
        clearInterval(intervalId);
    });
}


function sseResponse(sseRes, message) {
    sseRes.write(`data: ${message}`);
}

app.get('/event-stream', (req, res) => {
    // SSE Setup
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    res.write('\n');


    /*
    let messageId = 0;
    setInterval(() => {    
        res.write(`id: ${messageId}\n`);
        res.write(`data: ${messageId}\n`);
    }, 1000);
    */

    sseRes = res;

    let messageId = -1;
   res.write(`id: ${messageId}\n`);
   res.write(`data: this is a message from the server\n\n`);

    //sseDemo(req, res);
});






app.listen(3000, function () {
    debug(`Listening on port ${chalk.green("3000")}`);
});


