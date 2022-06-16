const router = require("express").Router();

const { getTickets, addTicket, getTicketById, getUserTickets, updateTicket } = require('../../controllers/tickets');

const { ticketAddValidator } = require('../../validators/tickets');

router.get('/current', getUserTickets);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.patch('/:id', updateTicket);
router.post('/', ticketAddValidator, addTicket);

module.exports = router;
