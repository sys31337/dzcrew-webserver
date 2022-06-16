const mongoose = require('mongoose');

const RolesSchema = new mongoose.Schema({
    roleId: { type: String, required: true },
    name: { type: String, required: true },
    color: { type: String, required: true }
});

const DiscordRole = mongoose.model('ServerRole', RolesSchema);
module.exports = DiscordRole;
