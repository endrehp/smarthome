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
        
            devices = results;
            let lights = devices.filter(device => {
                return (device.type === "Light")  
            });

            let lightObjects = []
            for (let i = 0; i<lights.length; i++) {
                lightmode = {R: 0, G: 0, B: 0, Brightness: 0};
                lightObjects.push({...lights[i], ...lightmode});

            }

            res.render(
                'modeEditor',
                {
                    nav,
                    title: 'Mode Editor',
                    mode: {},
                    lightObjects
                });
            });
            
        } else {

        let query = 'SELECT * FROM modes WHERE modeID=?;SELECT * FROM lightmodes WHERE modeID =?;SELECT * FROM devices';
 
        pool.query(query, [id, id], (err, results, fields) => {
            
            if (err) throw new Error(err);
            debug(results);
            console.log(results);
        
            lightmodes = results[1];
            devices = result[2];
            let lights = devices.filter(device => {
                return (device.type === "Light")  
              });

            let lightObjects = [];
            for (let i = 0; i<lights.length; i++) {
                lightmode = lightmodes.find(obj => obj.lightID === lights[i].deviceID);
                lightObjects.push({...lights[i], ...lightmode});

            }


            res.render(
                'modeEditor',
                {
                    nav,
                    title: 'Mode Editor',
                    mode: results[0][0],
                    lightObjects
                }
                );
        });
    }
    });

    

    return  modeRouter;
}

module.exports = router;