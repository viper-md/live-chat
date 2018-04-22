"use strict";
process.env.NODE_CONFIG_DIR = 'Config/';
global.config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const app = new express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

const startServer = http.createServer(app).listen(config.get('PORT'), function (err) {
    console.log(err ? err : 'Server Running on port' + config.get('PORT'));
    startInitialProcess();
});

function startInitialProcess() {
    var Moptions = {
        autoReconnect: true,
        bufferMaxEntries: 0,
        autoIndex: false,
        poolSize: 5,
    };
    mongoose.connect(config.get("databaseSettings.mongo_db_connection"), Moptions, function (err) {
        console.log("Mongo Connection", err ? err : 'Mongoose working', config.get("databaseSettings.mongo_db_connection"));
    });
}
process.on('unhandledRejection', (err) => {
    console.error('An unhandledRejection error occurred!');
    console.error(err.stack)
});
process.on('uncaughtException', function (err) {
    console.error('An uncaught error occurred!');
    console.error(err.stack);
});