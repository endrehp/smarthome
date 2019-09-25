const express = require('express');
const sql = require('mysql');
const pool = require('../datasource/database');
const modeRouter = express.Router();
const debug = require('debug')('app:modeRoutes');

function router(nav) {

    modeRouter.route('/').get((req,res) => {

        pool.query('SELECT * FROM modes', (err, results, fields) => {
            if (err) throw new Error(err);
            debug(results);
        


            res.render(
                'modeListView',
                {
                    nav,
                    title: 'Modes',
                    modes: results
                }
                );
        });
        
    });

    modeRouter.route('/modeEditor/:id').get((req,res) => {

        const { id } = req.params;

        if (id === "new") {

            let query = 'SELECT * FROM devices';
 
            pool.query(query, (err, results, fields) => {
                
            if (err) throw new Error(err);
        
            let devices = results;
            let lights = devices.filter(device => {
                return (device.type === "Light")  
            });

            let lightObjects = []
            for (let i = 0; i<lights.length; i++) {
                lightmode = {R: 0, G: 0, B: 0, Brightness: 0};
                lightObjects.push({...lights[i], ...lightmode});

            }

            let frames = devices.filter(devices => {
                return (devices.type === "Frame")
            });

            let frameObjects = []
            for (let i = 0; i<frames.length; i++) {
                framemode = {};
                frameObjects.push({...frames[i], ...framemode});
            }


            res.render(
                'modeEditor',
                {
                    nav,
                    title: 'Mode Editor',
                    mode: {modeID: "new"},
                    lightObjects,
                    frameObjects,
                    lightObjects_string: JSON.stringify(lightObjects),
                    frameObjects_string: JSON.stringify(frameObjects)
                });
            });
            
        } else {

        let query = 'SELECT * FROM modes WHERE modeID=?;SELECT * FROM lightmodes WHERE modeID =?;SELECT * FROM framemodes WHERE modeID =?;SELECT * FROM devices';
 
        pool.query(query, [id, id, id], (err, results, fields) => {
            
            if (err) throw new Error(err);
            debug(results);
            console.log(results);
        
            let mode = results[0][0];
            let lightmodes = results[1];
            let framemodes = results[2];
            let devices = results[3];

            let lights = devices.filter(device => {
                return (device.type === "Light")  
              });

            let lightObjects = [];
            for (let i = 0; i<lights.length; i++) {
                lightmode = lightmodes.find(obj => obj.lightID === lights[i].deviceID);
                lightObjects.push({...lights[i], ...lightmode});

            }

            let frames = devices.filter(devices => {
                return (devices.type === "Frame")
            });

            let frameObjects = []
            for (let i = 0; i<frames.length; i++) {
                framemode = framemodes.find(obj => obj.frameID === frames[i].deviceID);
                frameObjects.push({...frames[i], ...framemode});
            }


            res.render(
                'modeEditor',
                {
                    nav,
                    title: 'Mode Editor',
                    mode,
                    lightObjects,
                    frameObjects,
                    lightObjects_string: JSON.stringify(lightObjects),
                    frameObjects_string: JSON.stringify(frameObjects)
                }
                );
        });
    }
    });

    

    return  modeRouter;
}

module.exports = router;