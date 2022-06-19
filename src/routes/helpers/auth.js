const router = require("express").Router();
const passport = require("passport");

router.get("/", passport.authenticate("discord"));
router.get(
  "/redirect",
  passport.authenticate("discord")
);

router.get("/", (req, res) => {
  res.redirect(process.env.DISCORD_LOGIN);
});
router.get("/redirect", (req, res) => {
  res.redirect(process.env.REDIRECT_URL);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy(function (err) {
    res.sendStatus(200);
  });
});

module.exports = router;
