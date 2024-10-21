const validator = require("validator");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  badRequestError,
  notFoundError,
  serverError,
  alreadyExistsError,
  unauthorizedError,
} = require("../utils/errors");

// POST USERS
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res.status(badRequestError).send({ message: "Email required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(badRequestError).send({ message: "Invalid Email" });
  }
  if (!validator.isURL(avatar)) {
    return res.status(badRequestError).send({ message: "Invalid URL" });
  }

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error("Email already in use");
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
      if (e.name === "ValidationError") {
        return res.status(badRequestError).send({ message: "Invalid Data" });
      }
      if (e.message === "Email already in use") {
        return res
          .status(alreadyExistsError)
          .send({ message: "Email already in use" });
      }
      return res.status(serverError).send({ message: "Error from createUser" });
    });
};

// GET ME
const getCurrentUser = (req, res) => {
  const id = req.user._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        return res.send({ message: user });
      }
      return Promise.reject(new Error("User Not Found"));
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "User Not Found") {
        return res.status(notFoundError).send({ message: "User Not Found" });
      }
      return res
        .status(serverError)
        .send({ message: "Error from getCurrentUser" });
    });
};

// SIGN IN
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(badRequestError)
      .send({ message: "Incorrect email or password" });
  }

  if (!validator.isEmail(email)) {
    return res.status(badRequestError).send({ message: "Invalid Email" });
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
        res
          .status(unauthorizedError)
          .send({ message: "Incorrect email or password" });
      } else {
        res.status(serverError).send({
          message: "Error from login",
        });
      }
    });
};

const updateUser = (req, res) => {
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
      throw new Error("Not found");
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "Not found") {
        return res.status(notFoundError).send({ message: "User not found" });
      }
      if (e.name === "ValidationError") {
        return res.status(badRequestError).send({ message: "Invalid Data" });
      }
      return res.status(serverError).send({ message: "Error from updateUser" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
