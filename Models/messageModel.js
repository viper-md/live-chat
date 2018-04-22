'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema

const message = new Schema({
    messageType: { type: String, enum: ['text', 'image', 'loc', 'alert'], required: true, default: 'text' },
    event_id: { type: String },
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chat'
    },
    sender: { type: String, required: true },
    info: { type: String, required: true },
    localCreatedAt: { type: Number },
    createdAt: { type: Date, default: Date.now() },
});
message.index({ localCreatedAt: 1 });
module.exports = mongoose.model('message', message);