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
console.log(" __dirname + '/Views'", __dirname + '/Views');
let html_file_path = __dirname + '/views/index.html';
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views'));
app.set('view engine', 'html');
const chatApp = require("./Routes/chat-routes");
app.use("/api/v1/", chatApp);
app.get("/", function (req, res) {
    res.sendFile(html_file_path);
});
const swagger = require("swagger-express");
app.use(swagger.init(app, {
    apiVersion: '1.0',
    swaggerVersion: '1.0',
    basePath: config.get("swaggerLink"),
    swaggerURL: '/swagger',
    swaggerJSON: '/api-docs.json',
    swaggerUI: './public/swagger/',
    apis: ['./api-doc.yml'],
}));
const startServer = http.createServer(app).listen(config.get('PORT'), function (err) {
    console.log(err ? err : 'Server Running on port' + config.get('PORT'));
    startInitialProcess();
});

function startInitialProcess() {
    var Moptions = {
        autoReconnect: true,
        bufferMaxEntries: 0,
        autoIndex: true,
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