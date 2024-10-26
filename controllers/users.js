const validator = require("validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/BadRequestError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// POST USERS
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return next(new BadRequestError("Email required"));
  }
  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid Email"));
  }
  if (!validator.isURL(avatar)) {
    return next(new BadRequestError("Invalid URL"));
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError("Email already in use");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((newUser) =>
      res.send({
        name: newUser.name,
        avatar: newUser.avatar,
        email: newUser.email,
      })
    )
    .catch((e) => {
      console.error(e);
      if (e instanceof ConflictError) {
        next(e);
      }
      if (e.name === "ValidationError") {
        return next(new BadRequestError("Invalid Data"));
      }

      return next(e);
    });
};

// GET ME
const getCurrentUser = (req, res, next) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({ message: user });
      }
      throw new NotFoundError("User Not Found");
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "User Not Found") {
        return next(new NotFoundError("User Not Found"));
      }
      return next(e);
    });
};

// SIGN IN
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Incorrect email or password"));
  }

  if (!validator.isEmail(email)) {
    throw new ConflictError("Invalid Email");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((e) => {
      console.error(e);
      if (e.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(e);
    });
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { runValidators: true, new: true }
  )
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError("User not found");
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "CastError" || e.name === "ValidationError") {
        return next(new BadRequestError("Invalid Data"));
      }

      return next(e);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
