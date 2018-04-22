"use strict";
const models = require('../Models');
const DAOManager = require('../DOAManager');
const sendResponse = require('../Utils/sendResponse');
const utils = require("./commonFunctions");
const async = require("async");
exports.create_chat_group = function (req, res) {
    let groupName = req.body.groupName || "",
        participants = (req.body.participants || "").trim().toLowerCase(), // comma seperated values 
        cb = utils.checkBlank([groupName, participants]);
    if (cb == 1) return sendResponse.parameterMissingError(res);
    let currentDateTime = new Date();
    async.autoInject({
        create_chat: function (callback) {
            let dataToSet = {
                participants: participants.split(","),
                groupName: groupName,
                localCreatedAt: currentDateTime.getTime()
            };
            DAOManager.saveData(models.chat, dataToSet, callback);
        },
        first_message: function (create_chat, callback) {
            let dataToSet = {
                chat: create_chat._id,
                sender: "ADMIN",
                info: "New Group Created",
                localCreatedAt: currentDateTime.getTime()
            };
            DAOManager.saveData(models.message, dataToSet, callback);
        },
        publish: function (create_chat, first_message, callback) {
            utils.chat_publisher(groupName, first_message, callback);
        }
    }, function (error, data) {
        if (error) {
            if (typeof error == "string") return sendResponse.sendErrorMessage(error, res);
            return sendResponse.sendErrorMessage("Something went wrong, please try again later", res);
        }
        return sendResponse.sendSuccessData(data.create_chat, res);
    });
}

exports.send_message = function (req, res) {
    let chat_id = req.body.chat_id || "",
        message = req.body.message || "",
        sender = (req.body.sender || "").toLowerCase(),
        cb = utils.checkBlank([chat_id, message, sender]);
    if (cb == 1) return sendResponse.parameterMissingError(res);
    let currentDateTime = new Date();
    async.autoInject({
        validate_chat_id: function (callback) {
            let query = { _id: chat_id, isActive: { $ne: "NO" }, participants: sender };
            let projection = { _id: 1, participants: 1, groupName: 1 };
            let options = { lean: true };
            DAOManager.getData(models.chat, query, projection, options, callback);
        },
        publish_message: function (validate_chat_id, callback) {
            if (validate_chat_id && validate_chat_id.length) {
                return utils.chat_publisher(validate_chat_id[0].groupName, message, callback);
            }
            return callback("Chat room doesn't exist");
        },
        store_message: function (publish_message, callback) {
            let dataToSet = {
                chat: chat_id,
                sender: sender,
                info: message,
                localCreatedAt: currentDateTime.getTime()
            };
            DAOManager.saveData(models.message, dataToSet, callback);
        },
        update_last_message: function (publish_message, callback) {
            let query = { _id: chat_id };
            let update = { $set: { lastMessageAt: currentDateTime.getTime() } };
            let options = { lean: true };
            DAOManager.update(models.chat, query, update, options, callback);
        }
    }, function (error, data) {
        if (error) {
            if (typeof error == "string") return sendResponse.sendErrorMessage(error, res);
            return sendResponse.sendErrorMessage("Something went wrong, please try again later", res);
        }
        return sendResponse.sendSuccessData("message sent", res);
    });
}

// paginated list
exports.get_message_list = function (req, res) {
    let chat_id = req.body.chat_id || req.params.chat_id || "",
        cb = utils.checkBlank([chat_id]);
    if (cb == 1) return sendResponse.parameterMissingError(res);
    async.autoInject({
        validate_chat_id: function (callback) {
            let query = { _id: chat_id, isActive: { $ne: "NO" } };
            let projection = { _id: 1, participants: 1, groupName: 1 };
            let options = { lean: true };
            DAOManager.getData(models.chat, query, projection, options, callback);
        },
        get_messages: function (validate_chat_id, callback) {
            let query = {
                chat: chat_id
            };
            let projection = {};
            let options = { lean: true, sort: { localCreatedAt: -1 } };
            DAOManager.getData(models.message, query, projection, options, callback);
        }
    }, function (error, data) {
        if (error) {
            if (typeof error == "string") return sendResponse.sendErrorMessage(error, res);
            return sendResponse.sendErrorMessage("Something went wrong, please try again later", res);
        }
        return sendResponse.sendSuccessData(data.get_messages, res);
    });
}

exports.chat_list_of_user = function (req, res) {
    let user_name = (req.body.user_name || "").toLowerCase()
    if (!user_name) return sendResponse.parameterMissingError(res);
    async.waterfall([
        function (callback) {
            let query = { participants: user_name };
            let projection = {};
            let options = { lean: true, sort: { lastMessageAt: -1, localCreatedAt: -1 } };
            DAOManager.getData(models.chat, query, projection, options, callback);
        }
    ], function (error, data) {
        if (error) return sendResponse.sendErrorMessage("Something went wrong", res);
        return sendResponse.sendSuccessData(data, res);
    });
}