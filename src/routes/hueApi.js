// Database connection
const express = require('express');
const pool = require('../datasource/database');
const hueRouter = express.Router();
const debug = require('debug')('app:modeRoutes');

function router(){

    hueRouter.route('/setMode').post((req, res) => {

        let modeID = req.body.modeID;
        console.log("Set mode: " + modeID);

        setLights(modeID);

        res.json(JSON.stringify({result: 'success', modeID}));

    });

    hueRouter.route('/bright').get((req, res)=>{
        
        for (let i=0; i<lampIDs.length; i++) {
            
            setTimeout(() => setLight(255,255,255,20,lampIDs[i]), 400);
        }

    });
    return hueRouter;
}

module.exports = router;


// Light setting
const v3 = require('node-hue-api').v3
    , discovery = v3.discovery
    , hueApi = v3.api
    ;
const LightState = v3.lightStates.LightState;

var ipAdress = "192.168.0.23";  // from hue.getBridges
var user = "nF0hElD3YBelZfqsbpfWouMZryQraKnNKFFjjvoG"; // from hue.auth
var lampIDs = [4, 6, 7, 9, 8];

// Fare for tagras her
var lampHueIDs = [[1,1], [2,4], [3,6], [4,7], [5,8], [6,9], [7,2], [8,3]];

// Set ligths by mode ID
function setLights(id) {

    let query = 'SELECT * from lightmodes WHERE modeID =?';

    pool.query(query, [id], (err, results, fields) => {
        if (err) throw new Error(err);
        //console.log(results);

        if (results.length != 0) {
            for (var i = 0; i < results.length; i++) {
                var lightmode = results[i];
                var red = lightmode.R;
                var green = lightmode.G;
                var blue = lightmode.B;
                var brightness = lightmode.Brightness;
                var ID = lightmode.lightID;//lampHueIDs[i][1];
                setLight(red, green, blue, brightness, ID);
            }
        }

    });

}

/*
async function setAllLights(red, green, blue, bright) {

    var hue, saturation, light;
    [hue, saturation, light] = rgbToHSB(red, green, blue);

    console.log(hue + " " + saturation + " " + light);

    const state = new LightState()
        .on()
        .hue(hue)
        .sat(saturation)
        .brightness(bright)
        ;

    for (var i = 0; i < lampIDs.length; i++) {

        await v3.discovery.nupnpSearch()
            .then(searchResults => {
                const host = searchResults[0].ipaddress;
                return v3.api.create(host, user);
            })
            .then(api => {
                // Using a LightState object to build the desired state


                return api.lights.setLightState(lampIDs[i], state);
            })

    }

}
*/

async function setLight(red, green, blue, bright, lightID) {
    var hue, saturation, light;
    [hue, saturation, light] = rgbToHSB(red, green, blue);

    if (lampIDs.includes(lightID)) {
        const state = new LightState()
            .on()
            .hue(hue)
            .sat(saturation)
            .brightness(bright)
            ;

        await v3.discovery.nupnpSearch()
            .then(searchResults => {
                const host = searchResults[0].ipaddress;
                return v3.api.create(host, user);
            })
            .then(api => {
                // Using a LightState object to build the desired state
                return api.lights.setLightState(lightID, state);
            })
    }

}

function rgbToHSB(red, green, blue) {

    var hue;
    var cmax = Math.max(red, green, blue);
    var cmin = Math.min(red, green, blue);
    var lightness = (cmax + cmin) / 2;
    var delta = cmax - cmin;

    if (red >= green && green >= blue) {
        if (delta == 0) {
            hue = 0;
        } else {
            hue = (green - blue) / (red - blue);
        }
    } else if (red >= blue && blue > green) {
        hue = 6 - (blue - green) / (red - green);
    } else if (green > red && red >= blue) {
        hue = 2 - (red - blue) / (green - blue);
    } else if (green >= blue && blue > red) {
        hue = 2 + (blue - red) / (green - red);
    } else if (blue > red && red >= green) {
        hue = 4 + (red - green) / (blue - green);
    } else if (blue > green && green > red) {
        hue = 4 - (green - red) / (blue - red);
    }

    hue = Math.floor(hue * 60 * 182.04);

    //console.log("delta:" + delta + " lightness: " + lightness + " ");
    var saturation = 0;
    if (delta != 0) {
        saturation = Math.floor((254 / 255) * (delta / (1 - Math.abs(2 * (lightness / 255) - 1))) - 1);
    }

    return [hue, saturation, Math.floor(lightness)];
}