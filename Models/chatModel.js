"use strict";
const mongoose = require('mongoose');
const Schema = mongoose.Schema
let chat = new Schema({
    participants: [{ type: String, default: [], required: true }],
    isActive: { type: String, enum: ['YES', 'NO'], required: true, default: 'YES' },
    groupAvatar: { type: String, default: '', },
    groupName: { type: String, default: '' },
    localCreatedAt: { type: Number, required: true },
    deActivatedAt: { type: Number }
});
chat.index({ participants: 1 }, { sparse: true });
module.exports = mongoose.model('chat', chat);