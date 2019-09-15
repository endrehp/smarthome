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


        pool.query('SELECT * FROM modes WHERE modeID=' + id, (err, results, fields) => {
            
            if (err) throw new Error(err);
            debug(results);
        


            res.render(
                'modeEditor',
                {
                    nav,
                    title: 'Mode Editor',
                    //mode: results[0]
                }
                );
        });
        
    });

    return  modeRouter;
}

module.exports = router;