const ClothingItem = require("../models/clothingItem");

const NotFoundError = require("../errors/NotFoundError");
const ForbiddenError = require("../errors/ForbiddenError");
const BadRequestError = require("../errors/BadRequestError");

// GET CLOTHING ITEM
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((e) => {
      console.error(e);
      next(e);
    });
};

// POST CLOTHING ITEM
const createItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
      console.log(req.body, owner);
    })
    .catch((e) => {
      console.error(e);
      if (e.name === "ValidationError") {
        next(new BadRequestError("Invalid Data"));
      } else {
        next(e);
      }
    });
};

// DELETE CLOTHING ITEM
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        throw new ForbiddenError("You are not authorized to delete this item");
      }

      return ClothingItem.findByIdAndDelete(itemId)
        .then(() => res.send({ message: "Item deleted successfully" }))
        .catch((e) => {
          console.error(e);
          if (e instanceof NotFoundError || e instanceof ForbiddenError) {
            next(e);
          } else if (e.name === "CastError") {
            next(new BadRequestError("Invalid Data"));
          }
          next(e);
        });
    })
    .catch((e) => {
      console.error(e);

      if (e.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found"));
      }
      if (e.name === "CastError") {
        return next(new BadRequestError("Invalid Data"));
      }

      return next(e);
    });
};

// PUT LIKES
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e instanceof NotFoundError) {
        next(e);
      }
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }

      next(e);
    });
};

// DELETE LIKES
const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      console.error(e);

      if (e instanceof NotFoundError) {
        next(e);
      }
      if (e.name === "CastError") {
        next(new BadRequestError("Invalid Data"));
      }

      next(e);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
