const ClothingItem = require("../models/clothingItem");

const {
  badRequestError,
  notFoundError,
  serverError,
  forbiddenError,
} = require("../utils/errors");

// GET CLOTHING ITEM
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((e) => {
      console.error(e);
      return res.status(serverError).send({ message: "Error from getItem" });
    });
};

// POST CLOTHING ITEM
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        res.status(badRequestError).send({ message: "Invalid Data" });
      } else {
        res.status(serverError).send({ message: "Error from createItem" });
      }
    });
};

// DELETE CLOTHING ITEM
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        return res
          .status(forbiddenError)
          .send({ message: "You are not authorized to delete this item" });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Item deleted successfully" })
      );
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(badRequestError).send({ message: "Invalid Data" });
      }

      return res.status(serverError).send({ message: "Error from deleteItem" });
    });
};

// PUT LIKES
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(badRequestError).send({ message: "Invalid Data" });
      }

      return res.status(serverError).send({ message: "Error from likeItem" });
    });
};

// DELETE LIKES
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: "Item not found" });
      }
      if (e.name === "CastError") {
        return res.status(badRequestError).send({ message: "Invalid Data" });
      }

      return res
        .status(serverError)
        .send({ message: "Error from dislikeItem" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
