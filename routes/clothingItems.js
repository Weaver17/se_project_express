const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const auth = require("../middlewares/auth");

// GET
router.get("/", getItems);

// POST
router.post("/", auth, createItem);

// DELETE
router.delete("/:itemId", auth, deleteItem);

// PUT LIKE
router.put("/:itemId/likes", auth, likeItem);

// DELETE LIKE
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
