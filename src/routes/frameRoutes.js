const express = require('express');
const sql = require('mysql');
const pool = require('../datasource/database');
const frameRouter = express.Router();
const debug = require('debug')('app:frameRoutes');

function router(nav) {

    frameRouter.route('/').get((req,res) => {

        let url = 'IMG_0883.jpg';

        res.render(
            'digitalFrameView',{
                url
            }
            );  
    });

    return  frameRouter;
}

module.exports = router;