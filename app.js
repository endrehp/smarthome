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
  { link: '/devices', title: 'Devices' }
];

const modeRouter = require('./src/routes/modeRoutes')(nav);
//const deciveRouter = require('./src/routes/deviceRoutes')(nav);
//const lightApi = require('./src/routes/lightApi');


app.use('/modes', modeRouter);
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

app.post('/saveMode', (req, res) => {

    // Write mode data to database
    //console.log("Request body:");
    //console.log(req.body);
    let modeData = req.body;
    let lightObjects = modeData.lightObjects;
    let modeID = modeData.modeID;


    if (modeID == "new") {

        // If new mode
        // Build query:
        let query = "INSERT INTO modes (Title, Description) VALUES ('"+ modeData.title 
            +"', '"+ modeData.description +"');SELECT LAST_INSERT_ID()";
        
        pool.query(query, (err, results, fields) => {
            if (err) throw new Error(err);
            //let id = results[1]['LAST_INSERT_ID()'];
            modeID = results[1][0]['LAST_INSERT_ID()']
            console.log("New id: " + modeID);

            // Build query for lightmodes
            let lightmodes_query = "INSERT INTO lightModes (modeID, lightID, R, G, B, Brightness) VALUES ";
            for (let i=0; i<lightObjects.length; i++){
                let l_obj = lightObjects[i]; 
                lightmodes_query += "("+modeID+"," + l_obj.deviceID + "," +l_obj.R+","+ l_obj.G+","+ l_obj.B+","+ l_obj.Brightness+")";

                if (i<lightObjects.length-1) {
                    lightmodes_query += ",";
                }
            }

            pool.query(lightmodes_query, (err, results, fields) => {
                if (err) throw new Error(err);

            })

        })

    } else {
        // Else if mode already in database
        // Build query for lightmodes
        let lightmodes_query = "";//"INSERT INTO lightModes (modeID, lightID, R, G, B, Brightness) VALUES ";
        for (let i=0; i<lightObjects.length; i++){
            let l_obj = lightObjects[i]; 
            lightmodes_query += "UPDATE lightModes SET R=" +l_obj.R
            + ", G=" + l_obj.G
            + ", B=" + l_obj.B
            + ", Brightness=" + l_obj.Brightness
            + " WHERE modeID=" + modeID
            + " AND lightID=" + l_obj.deviceID;

            if (i<lightObjects.length-1) {
                lightmodes_query += ";";
            }
        }

        console.log(lightmodes_query);
        
        pool.query(lightmodes_query, (err, results, fields) => {
            if (err) throw new Error(err);

        })
        
    }

    res.json(JSON.stringify({result: 'success', modeID}));
    


}); 



app.listen(3000, function () {
    debug(`Listening on port ${chalk.green("3000")}`);
});