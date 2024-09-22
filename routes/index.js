const router = require("express").Router();

const userRouter = require("./users");

const itemRouter = require("./clothingItems");

const { notFoundError } = require("../utils/errors");

const { login, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", itemRouter);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res.status(notFoundError).send({ message: "Router not found" });
});

module.exports = router;
