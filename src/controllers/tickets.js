const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Ticket = require("../models/ticket");
const DiscordUser = require("../models/DiscordUser");
const path = require("path");

exports.updateTicket = async (req, res, next) => {
  try {
    if (req.user) {
      const { id } = req.params;
      const { reply, closeTicket } = req.body;
      const status = closeTicket ? "processed" : "processing";
      const { roles } = await rest.get(
        Routes.guildMember(process.env.GUILD_ID, req.user.discordId)
      );
      const staffRoles = process.env.STAFFROLES.split(" ");
      const isStaff = roles.some((r) => staffRoles.indexOf(r) >= 0);
      const replyPayload = { ...reply, isStaff };
      const ticket = await Ticket.findByIdAndUpdate(
        id,
        {
          status,
          $push: { replies: replyPayload },
        },
        { new: true }
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
      const ticketPayload = { ...body, sender: user._id, attachments: dbFiles };
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
      const ticketId = req.params.id;
      const ticket = await Ticket.findById(postId)
        .select("-_id -__v")
        .populate("sender", "firstName lastName")
        .lean();
      res.status(200).json(post);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
  }
};
