const express = require('express');
const sql = require('mysql');
const pool = require('../datasource/database');
const frameRouter = express.Router();
const debug = require('debug')('app:frameRoutes');

let sseRes;

function router(nav) {

    frameRouter.route('/').get((req,res) => {

        let url = 'IMG_0883.jpg';

        res.render(
            'digitalFrameView',{
                url
            }
            );  
    });

    frameRouter.get('/event-stream', (req, res) => {
        // SSE Setup
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });
        res.write('\n');
    
        sseRes = res;
    
        let messageId = -1;
       res.write(`id: ${messageId}\n`);
       res.write(`data: this is a message from the server\n\n`);
    
        //sseDemo(req, res);
    });

    return  frameRouter;
}

module.exports = router;