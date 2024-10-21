const router = require("express").Router();

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { notFoundError } = require("../utils/errors");

const { NotFoundError } = require("../errors/NotFoundError");

const {
  validateUserBody,
  ValidateLogin,
  validateLogin,
} = require("../middlewares/validation");

const { login, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, login);

router.use((req, res, next) => {
  next(new NotFoundError(notFoundError));
});

module.exports = router;
