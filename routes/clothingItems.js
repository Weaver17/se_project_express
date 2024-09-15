const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// GET
router.get("/", getItems);

// POST
router.post("/", createItem);

// DELETE
router.delete("/:itemId", deleteItem);

// PUT LIKE
router.put("/:itemId/likes", likeItem);

//DELETE LIKE
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
