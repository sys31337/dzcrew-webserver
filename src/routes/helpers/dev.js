const router = require("express").Router();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const DiscordRole = require("../../models/serverRoles");
const db = require("../../database/database");
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
const mongoose = require('mongoose');

router.get("/refreshServerRoles", async (req, res) => {
  try {
    const roles = await rest.get(Routes.guildRoles(process.env.GUILD_ID));
    const dbRoles = [];
    await mongoose.connection.db.dropCollection('serverroles', function(err, result) {
      console.log(err)
      console.log(result)
    });
    await roles.map((role) => {
      const roleId = role.id;
      const name = role.name;
      const color =
      role.color.toString(16).toUpperCase() != "0"
      ? `#${role.color.toString(16).toUpperCase()}`
      : "#FFFFFF";
      dbRoles.push({ roleId, name, color });
    });
    

    await DiscordRole.insertMany(dbRoles, function (error, docs) {
      console.log(error);
    });

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
