const express = require("express");
const authMiddleware = require("../middlewares/auth");

const Item = require("../models/Item");

const router = express.Router();

router.use(authMiddleware);

router.post("/item", async (req, res) => {
  try {
    const item = await Item.create({ ...req.body, user: req.userId });

    return res.status(201).send({ item });
  } catch (err) {
    return res.status(400).send({ error: "Error creating new item" });
  }
});

/*
router.get("/item/user", async (req, res) => {
  try {
    const item = await Item.find({ ...req.body, user: req.userId });

    if (user == item.user) return res.status(200).send({ item });
  } catch (err) {
    return res.status(400).send({ error: "Error loading user items" });
  }
});
*/

router.get("/item", async (req, res) => {
  try {
    const items = await Item.find().populate("user");

    return res.status(200).send({ items });
  } catch (err) {
    return res.status(400).send({ error: "Error loading items" });
  }
});

router.get("/item/:itemId", async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId).populate("user");

    return res.status(200).send({ item });
  } catch (err) {
    return res.status(400).send({ error: "Error loading item" });
  }
});

router.put("/item/:itemId", async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.itemId).populate(
      "user"
    );

    return res.send({ item });
  } catch (err) {
    return res.status(400).send({ error: "Error loading item" });
  }
});

router.delete("/item/:itemId", async (req, res) => {
  try {
    const item = await Item.findByIdAndRemove(req.params.itemId);

    return res.status(200).send({ sucess: "Deleted item" });
  } catch (err) {
    return res.status(400).send({ error: "Error deleting item" });
  }
});

module.exports = app => app.use("/api/v1", router);
