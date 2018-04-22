"use strict";
const zlib = require('zlib');
exports.send_custom_response = function (res, message, data, status, flag) {
    let msg = { status: status, message: message, data: data, flag: flag };
    sendData(msg, res);
};
exports.resource_not_found = function (res, flag = {}) {
    var errorMsg = { status: 404, message: 'Resources not found', flag: 0 };
    sendData(errorMsg, res);
};
exports.sendErrorMessage = function (error, res, flag = {}) {
    const errorMsg = {
        status: 400,
        message: error,
        flag: 0
    }
    sendData(errorMsg, res);
};
exports.sendSuccessData = function (data, res, message, flag = {}) {
    var successData = { status: 200, data: data, message: message || "", flag: 0 };
    sendData(successData, res);
};
exports.sendGzippedResponse = function (response, res) {
    zlib.gzip(JSON.stringify(response), function (err, zippedData) {
        if (err) {
            return res.send(response);
        }
        res.set({ 'Content-Encoding': 'gzip' });
        return res.send(zippedData);
    });
}
function sendData(data, res) {
    res.type('json');
    res.jsonp(data);
};
exports.sendData = function (data, res) {
    res.type('json');
    res.jsonp(data);
};
