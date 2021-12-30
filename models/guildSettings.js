const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
    guildID: String,
})

module.exports = mongoose.model("guildSettings", guildSettingsSchema)