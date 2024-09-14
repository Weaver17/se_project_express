const User = require("../models/user");

// GET USERS
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((e) => {
      res.status(500).send({ message: "Error from getUsers", e });
    });
};

// GET USER VIA ID
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById({ userId }).then((user) => {
    res.send({ data: user }).catch((e) => {
      res.status(500).send({ message: "Error from getUserById", e });
    });
  });
};

// POST USERS
const createUser = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      console.log(user);
      res.send({ data: user });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "ValidationError") {
        res.status(400).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
};
