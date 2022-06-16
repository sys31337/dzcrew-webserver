const Joi = require('joi');
const ObjectId = require('mongoose').Types.ObjectId;

const mongooseId = (id) => {
  if(ObjectId.isValid(id)){
      if((String)(new ObjectId(id)) === id)
          return true;
      return false;
  }
  return false;
}

const string = Joi.string().trim();
const number = Joi.number();
const boolean = Joi.bool();
const date = Joi.date();
const uri = Joi.string().uri();
const email = Joi.string().email();
const array = Joi.array();
const object = Joi.object();

module.exports = {
  mongooseId,
  string,
  uri,
  number,
  boolean,
  date,
  email,
  array,
  object,
};
