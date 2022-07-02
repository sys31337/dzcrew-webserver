require("dotenv").config();
require("./strategies/discordstrategy");
const express = require("express");
const fileupload = require("express-fileupload");
const app = express();
const PORT = process.env.PORT || 3001;
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const db = require("./database/database");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const origins = process.env.FRONTEND_ORIGIN.split(' ');
const corsOptions = {
  origin: ["https://dcroleplay.com",
  "https://www.dcroleplay.com",
  "http://www.dcroleplay.com",
  "http://dcroleplay.com",
  "http://main--heartfelt-piroshki-cda9c1.netlify.app",
  "https://main--heartfelt-piroshki-cda9c1.netlify.app"],
  credentials: true,
}


app.use(cors(corsOptions));
app.use(
  fileupload({
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.then(() => console.log("Connected to MongoDB.")).catch((err) =>
  console.log(err)
);

// Routes
const api = require("./routes");

app.use(
  session({
    secret: process.env.COOKIES_TOKEN,
    cookie: {
      maxAge: 60000 * 60 * 24,
    },
    saveUninitialized: false,
    resave: false,
    name: "discord.oauth2",
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

app.use(express.static(path.join(__dirname, "public")));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware Routes
app.use("/api", api);

app.listen(PORT, () =>
  console.log(`Now listening to requests on port ${PORT}`)
);

// https://discordapp.com/developers/docs/topics/permissions
