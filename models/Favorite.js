const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
  recipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recipe",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//MongoDB collection named here - will give lowercase plural of name. You can add a third argument in the model method if you don't like the default named convention. 
module.exports = mongoose.model("Favorite", FavoriteSchema);
