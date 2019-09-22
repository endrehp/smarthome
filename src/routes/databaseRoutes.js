const express = require('express');
const sql = require('mysql');
const pool = require('../datasource/database');
const databaseRouter = express.Router();
const debug = require('debug')('app:databseRoutes');

function router() {

    databaseRouter.route('/saveMode').post((req, res) => {

        // Write mode data to database
        console.log("Request body:");
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


    databaseRouter.route('/deleteMode').post((req, res) => { 

        let modeID = req.body.modeID;
        console.log("Delete mode: " + modeID);

        // Database query
        let query = "DELETE FROM modes WHERE modeID=?;DELETE FROM lightModes WHERE modeID=?";

        pool.query(query, [modeID, modeID], (err, results, fields) => { 
            if (err) throw new Error(err);
        });

        // Return json
        res.json(JSON.stringify({result: 'success', modeID}));

    });
    

    return  databaseRouter;
}

module.exports = router;