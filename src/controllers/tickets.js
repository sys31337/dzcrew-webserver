const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/ticket");
const DiscordUser = require("../models/DiscordUser");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

const path = require("path");

exports.updateTicket = async (req, res, next) => {
  try {
    req.user = { discordId: 536889212230696960 }

    if (req.user) {
      const { id } = req.params;
      const { message, closeTicket } = req.body;
      const { discordId } = req.user;
      const { roles } = await rest.get(Routes.guildMember(process.env.GUILD_ID, req.user.discordId));

      const { _id: sender } = await DiscordUser.findOne({ discordId });
      const staffRoles = process.env.STAFFROLES.split(" ");
      const status = closeTicket ? "processed" : "processing";
      const isStaff = roles.some((r) => staffRoles.indexOf(r) >= 0)
      const replyPayload = { sender, message, isStaff };
      const ticket = await Ticket.findOneAndUpdate(
        id,
        {
          status,
          $push: { replies: replyPayload },
        },
        { new: true, useFindAndModify: false }
      );
      res.status(200).json(ticket);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getTickets = async (req, res, next) => {
  try {
    if (req.user) {
      const allTickets = await Ticket.find()
        .populate("sender", "firstName lastName")
        .lean();
      res.status(200).json(allTickets);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addTicket = async (req, res, next) => {
  try {
    const ticketId = uuidv4().split('-')[0]
    if (req.user) {
      const Files = [];
      const dbFiles = [];
      if (req.files) {
        const fileKeys = Object.keys(req.files);

        fileKeys.forEach((key) => {
          Files.push(req.files[key]);
        });
      }
      Files.forEach((file) => {
        const ext = path.extname(file.name);
        file.mv(`${__dirname}/../public/uploads/${uuidv4()}${ext}`, (err) => {
          if (err) {
            return res.status(500).send(err);
          }

          dbFiles.push(`public/uploads/${uuidv4()}${ext}`);
        });
      });
      const { discordId } = req.user;
      const body = req.body;
      const user = await DiscordUser.findOne({ discordId })
        .select("_id")
        .lean();
      const ticketPayload = { ...body, id: ticketId, sender: user._id, attachments: dbFiles };
      const preCreateTicket = await Ticket.create({ ...ticketPayload });
      const createTicket = await Ticket.findById(preCreateTicket._id)
        .populate("author", "firstName lastName")
        .lean();
      res.status(200).json(createTicket);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
  }
};
exports.getUserTickets = async (req, res, next) => {
  try {
    if (req.user) {
      const { discordId } = req.user;
      const user = await DiscordUser.findOne({ discordId })
        .select("_id")
        .lean();
      const tickets = await Ticket.find({ sender: user._id });
      res.status(200).json(tickets);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getTicketById = async (req, res, next) => {
  try {
    if (req.user) {
      const id = req.params.id;
      const ticket = await Ticket.findOne({ id })
        .select("-_id -__v")
        .populate({
          path: 'replies',
          populate: {
            path: 'sender',
            model: 'User',
            select: 'discordId avatar'
          }
        })
        .lean();
      res.status(200).json(ticket);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
  }
};
