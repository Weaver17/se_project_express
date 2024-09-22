const router = require("express").Router();

const {
  getCurrentUser,
  updateUser,
  getUsers,
} = require("../controllers/users");

const auth = require("../middlewares/auth");

// GET
router.get("/", getUsers);

// GET CURRENT USER
router.get("/me", auth, getCurrentUser);

// UPDATE PROFILE
router.patch("/me", auth, updateUser);

// FIND BY ID
// router.get("/:userId", getUserById);

// POST
// router.post("/", createUser);

module.exports = router;
