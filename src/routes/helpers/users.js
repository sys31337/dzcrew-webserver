const router = require("express").Router();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const DiscordRole = require("../../models/serverRoles");
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
const {query, emptyOrRows} = require("../../helpers/mysql");

router.get("/getServerRoles", async (req, res) => {
  const discordRoles = await DiscordRole.find().select("-__v -_id").lean();
  res.status(200).json(discordRoles);
});

router.get("/getUserCharacters", async (req, res) => {
  const rows = await query(`SELECT * FROM players WHERE discord = ${req.user.discordId}`);
  const data = emptyOrRows(rows);
  res.status(200).json(data);
});

router.get("/getUserData", async (req, res) => {
  try {
    if (req.user) {
      const roles = await rest.get(
        Routes.guildMember(process.env.GUILD_ID, req.user.discordId)
      );
      res.status(200).json({
        login: true,
        id: req.user.discordId,
        username: req.user.username,
        avatar: req.user.avatar,
        roles: roles.roles,
        joinDate: roles.joined_at,
      });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
