import mongoose from "mongoose";
import Joi from "joi";

const supportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Support = mongoose.model("Support", supportSchema);

export const validateSupportRequest = (request) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    // phone: Joi.string().required(),
    message: Joi.string().required(),
  });

  return schema.validate(request);
};

export default Support;