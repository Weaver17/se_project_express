const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");

const auth = require("../middlewares/auth");

// GET CURRENT USER
router.get("/me", auth, getCurrentUser);

// UPDATE PROFILE
router.patch("/me", auth, updateUser);

module.exports = router;
