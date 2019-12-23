const mongoose = require("../../database");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  preco: {
    type: Number,
    require: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
