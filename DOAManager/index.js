'use strict';
let mongoose = require('mongoose').set('debug', true);
var saveData = function (model, data, callback) {
    new model(data).save(function (err, result) {
        if (err) return callback(err);
        return callback(null, result);
    });
};
var getData = function (model, query, projection, options, callback) {
    model.find(query, projection, options, function (err, data) {
        if (err) return callback(err);
        return callback(null, data);
    });
};
var update = function (model, conditions, update, options, callback) {
    model.update(conditions, update, options, function (err, result) {
        if (err) return callback(err);
        return callback(null, result);
    });
};
var aggregateData = function (model, group, callback) {
    model.aggregate(group, function (err, data) {
        if (err) return callback(err);
        return callback(null, data);
    });
};
module.exports = {
    saveData,
    getData,
    update,
    aggregateData
};