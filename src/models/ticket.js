const mongoose = require("mongoose");

const { Schema } = mongoose;

const ticketSchema = Schema({
  id: {
    type: String,
    unique: true,
  },
  subject: {
    type: String,
    maxLength: 100,
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    minLength: 10,
    required: true,
  },
  attachments: {
    type: [{ type: String }],
  },
  status: {
    type: String,
    enum: ["new", "processing", "processed"],
    default: "new",
  },
  replies: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      message: {
        type: String,
        required: true,
      },
      isStaff: {
        type: Boolean,
        required: true,
      }
    },
  ],
});

module.exports = mongoose.model("Ticket", ticketSchema);
