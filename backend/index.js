const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lw = require('@google-cloud/logging-winston');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8090;
const responseTime = require("response-time");
const logger = require("./utilites/logger");


async function main() {
    process.on('uncaughtException', function (err) {
        console.log(err)
        logger.error(err);
    });

    // Cors enabled
    app.use(cors());

    // response time header
    app.use(responseTime());

    if (process.env.NODE_ENV === 'PROD') {
        // Create a middleware that will use the provided logger.
        // A Stackdriver Logging transport will be created automatically
        // and added onto the provided logger.
        const mw = await lw.express.makeMiddleware(logger);
        // inserting logger as a middleware
        app.use(mw);
    }

    // body parser middleware
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));

    // db connection
    require('./db/connection');


    fs.readdirSync('./routes').forEach(function (file) {
        if (file.indexOf('.js')) {
            // include a file as a route constiable
            const route = require('./routes/' + file);
            // call controller function of each file and pass your app instance to it
            app.use(`/api/${file.split('.')[0]}`, route);
        }
    });


    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
        logger.info('Press Ctrl+C to quit');
    });
}

main();
