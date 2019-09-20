// Database connection
const express = require('express');
const pool = require('../datasource/database');
const modeRouter = express.Router();
const debug = require('debug')('app:modeRoutes');


// Light setting
const v3 = require('node-hue-api').v3
    , discovery = v3.discovery
    , hueApi = v3.api
    ;
const LightState = v3.lightStates.LightState;

var ipAdress = "192.168.0.23";  // from hue.getBridges
var user = "nF0hElD3YBelZfqsbpfWouMZryQraKnNKFFjjvoG"; // from hue.auth
var lamp1ids = [4, 6, 7, 9, 8];

// Set ligths by mode ID
function setLights(id) {

    let query = 'SELECT * from lightmodes WHERE modeID =?';

    pool.query(query, [id], (err, results, fields) => {
        if (err) throw new Error(err);
        //console.log(results);

        if (results.length != 0) {
            var lightmode = results[0];
            var red = lightmode.R;
            var green = lightmode.G;
            var blue = lightmode.B;
            var brightness = lightmode.Brightness;
            //setAllLights(red, green, blue, brightness);
            setAllAtOnce(red, green, blue, brightness);
        }

    });

}

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

    for (var i = 0; i < lamp1ids.length; i++) {

        await v3.discovery.nupnpSearch()
            .then(searchResults => {
                const host = searchResults[0].ipaddress;
                return v3.api.create(host, user);
            })
            .then(api => {
                // Using a LightState object to build the desired state


                return api.lights.setLightState(lamp1ids[i], state);
            })

    }

}

async function setLight(red, green, blue, bright, lightID) {
    var hue, saturation, light;
    [hue, saturation, light] = rgbToHSB(red, green, blue);

    if (lamp1ids.includes(lightID)) {
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

function setAllAtOnce(red, green, blue, brightness) {

    var delay = 10;

    setTimeout(() => {
        setLight(red, green, blue, brightness, 4);
    }, delay);
    setTimeout(() => {
        setLight(red, green, blue, brightness, 6);
    }, delay);
    setTimeout(() => {
        setLight(red, green, blue, brightness, 7);
    }, delay);
    setTimeout(() => {
        setLight(red, green, blue, brightness, 8);
    }, delay);
    setTimeout(() => {
        setLight(red, green, blue, brightness, 9);
    }, delay);

}

setLights(1);