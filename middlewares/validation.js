const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateId = (value, helpers) => {
  if (validator.isHexadecimal(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string-min": 'The minimum length of the "name" field is 2',
      "string-max": 'The maximum length of the "name" field is 30',
      "string-uri": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message("Must be a valid email")
      .messages({
        "string-empty": "Email field is required",
      }),
    password: Joi.string().required().messages({
      "string-empty": "Password field is required",
    }),
    name: Joi.string().required().min(2).max(30).messages({
      "string-min": 'The minimum length of the "name" field is 2',
      "string-max": 'The maximum length of the "name" field is 30',
      "string-uri": "Name field is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message("Must be a valid email")
      .messages({
        "string-empty": "Email field is required",
      }),
    password: Joi.string().required().messages({
      "string-empty": "Password field is required",
    }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).required().custom(validateId).messages({
      "string.uri": "Must be a hexadecimal value length of 24 characters",
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'The "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateItemBody,
  validateUserBody,
  validateLogin,
  validateUserId,
  validateUserUpdate,
};
