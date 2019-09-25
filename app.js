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
  { link: '/devices', title: 'Devices'},
  {link: '/playground', title: 'Playground'}
];

const modeRouter = require('./src/routes/modeRoutes')(nav);
const databaseRouter = require('./src/routes/databaseRoutes')();
const deviceRouter = require('./src/routes/deviceRoutes')(nav);
const hueRouter = require('./src/routes/hueApi')();
const frameRouter = require('./src/routes/frameRoutes')();


app.use('/modes', modeRouter);
app.use('/devices', deviceRouter);
app.use('/database', databaseRouter);
app.use('/hueApi', hueRouter);
app.use('/digitalFrame', frameRouter);
app.get('/', (req, res) => {

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


app.get('/playground', (req,res) => {

    res.render(
        'playground',
        {
            nav,
            title: "Playground"
        }
    );
});


app.listen(3000, function () {
    debug(`Listening on port ${chalk.green("3000")}`);
});