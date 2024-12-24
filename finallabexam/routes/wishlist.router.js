const express = require("express");
const router = express.Router();
const Wishlist = require("../../models/wishlist.model");
const Product = require("../../models/product.model");

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send("Please log in to add items to your wishlist.");
};

// Add to Wishlist Route
router.post("/wishlist/add/:productId", isAuthenticated, async (req, res) => {
    const productId = req.params.productId;
    const userId = req.user._id;

    try {
        let wishlist = await Wishlist.findOne({ userId: userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId: userId, products: [] });
        }

        // Check if the product is already in the wishlist
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
            await wishlist.save();
            return res.redirect("back"); // Redirect back to the previous page
        } else {
            return res.status(400).send("Product is already in your wishlist.");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    }
});

// View Wishlist Route
router.get("/wishlist", isAuthenticated, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate("products");
        res.render("wishlist", { layout: "admin/admin-layout", wishlist });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    }
});

module.exports = router;