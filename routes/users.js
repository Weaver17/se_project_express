const router = require("express").Router();

const { getCurrentUser, updateUser } = require("../controllers/users");

const auth = require("../middlewares/auth");

const { validateUserUpdate } = require("../middlewares/validation");

router.use(auth);

// GET CURRENT USER
router.get("/me", getCurrentUser);

// UPDATE PROFILE
router.patch("/me", validateUserUpdate, updateUser);

module.exports = router;
