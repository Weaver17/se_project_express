const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

const {
  validateItemBody,
  validateUserId,
} = require("../middlewares/validation");

// GET
router.get("/", getItems);

router.use(auth);

// POST
router.post("/", validateItemBody, createItem);

// DELETE
router.delete("/:itemId", validateUserId, deleteItem);

// PUT LIKE
router.put("/:itemId/likes", validateUserId, likeItem);

// DELETE LIKE
router.delete("/:itemId/likes", validateUserId, dislikeItem);

module.exports = router;
