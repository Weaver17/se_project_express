const router = require("express").Router();

const { getUsers, getUserById, createUser } = require("../controllers/users");

// GET
router.get("/", getUsers);

// FIND BY ID
router.get("/:userId", getUserById);

// POST
router.post("/", createUser);

module.exports = router;
