const Joi = require('joi');
const expressJoiValidation = require('express-joi-validation');

const { string, array } = require('./schema');

const validator = expressJoiValidation.createValidator({ passError: true });

const ticketAddSchema = Joi.object({
    staff: string.required(),
    subject: string.required(),
    message: string.required(),
    attachments: array,
});

const ticketAddValidator = validator.body(ticketAddSchema);

module.exports = {
    ticketAddValidator,
};