const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userID: { type: String, required: true },
    psn: { type: String, required: true },
    synced: { type: Boolean, required: true },
    gimoire: { type: Number, required: true }
})

module.exports = mongoose.model("profileSettings", profileSchema)