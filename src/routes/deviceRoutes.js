const express = require('express');
const sql = require('mysql');
const pool = require('../datasource/database');
const deviceRouter = express.Router();
const debug = require('debug')('app:deviceRoutes');

function router(nav) {

    deviceRouter.route('/').get((req,res) => {

        pool.query('SELECT * FROM devices', (err, results, fields) => {
            if (err) throw new Error(err);

            res.render(
                'deviceView',
                {
                    nav,
                    title: 'Devices',
                    devices: results
                }
                );
        });
        
    });


    

    return  deviceRouter;
}

module.exports = router;