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
        (async function query() {

            const { id } = req.params;
            let query = 'SELECT * FROM modes WHERE modeID=?'//;SELECT * FROM lightmodes WHERE modeID =?';

            let result = {}
            //if (id === 'new') {
                console.log('new');
            //} else {
                result = await pool.query(query, [id,id])
            //}
            
            res.render(
                'modeEditor',
            {
                nav,
                title: 'Mode Editor',
                mode: result.recordset
            });

        });
    });


    return  modeRouter;
}

module.exports = router;