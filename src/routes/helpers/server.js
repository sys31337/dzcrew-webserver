const router = require("express").Router();
const fetch = require("node-fetch");

router.get("/getServerInfo", async (req, res) => {
    try {
        fetch('http://176.118.193.95/?server')
            .then(response => response.json())
            .then(data => res.status(200).send(data));
    } catch (error) {
        console.log(error);
    }
});

router.get("/getPlayers", async (req, res) => {
    try {
        fetch('http://176.118.193.95/?players')
            .then(response => response.json())
            .then(data => res.status(200).send(data));
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
