const router = require("express").Router();
const authRoute = require("./helpers/auth");
const usersRoute = require("./helpers/users");
const devRoute = require("./helpers/dev");
const ticketsRoute = require("./helpers/tickets");

router.use("/dev", devRoute)

router.use("/auth", authRoute)
router.use("/users", usersRoute)
router.use("/tickets", ticketsRoute)
module.exports = router;
