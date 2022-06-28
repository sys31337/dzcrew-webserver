const router = require("express").Router();

const ticketsController = require("../../controllers/tickets");

const { ticketAddValidator } = require("../../validators/tickets");

router.get("/current", ticketsController.getUserTickets);
router.get("/", ticketsController.getTickets);
router.get("/:id", ticketsController.getTicketById);
router.patch("/:id", ticketsController.updateTicket);
router.post("/", ticketAddValidator, ticketsController.addTicket);

module.exports = router;
