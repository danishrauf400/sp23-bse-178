const mongoose = require("mongoose");

let wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User ", required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
});

let Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;