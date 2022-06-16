const Joi = require('joi');
const expressJoiValidation = require('express-joi-validation');

const { string } = require('./schema');

const validator = expressJoiValidation.createValidator({ passError: true });

const ticketAddSchema = Joi.object({
    subject: string.required(),
    message: string.required(),
});

const ticketAddValidator = validator.body(ticketAddSchema);

module.exports = {
    ticketAddValidator,
};