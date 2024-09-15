const User = require("../models/user");

const {
  badRequestError,
  notFoundError,
  serverError,
} = require("../utils/errors");

// GET USERS
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      console.error(e);

      return res.status(serverError).send({ message: "Error from getUsers" });
    });
};

// GET USER VIA ID
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: e.message });
      }
      if (e.name === "CastError") {
        return res.status(badRequestError).send({ message: e.message });
      }
      return res
        .status(serverError)
        .send({ message: "Error from getUserById" });
    });
};

// POST USERS
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        res.status(badRequestError).send({ message: e.message });
      } else {
        res.status(serverError).send({ message: "Error from createUser" });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
};
