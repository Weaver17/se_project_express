const router = require("express").Router();

const {
  createItem,
  getItem,
  deleteItem,
} = require("../controllers/clothingItems");

// GET
router.get("/", getItem);

// POST
router.post("/", createItem);

// DELETE
router.delete("/:itemId", deleteItem);

module.exports = router;
