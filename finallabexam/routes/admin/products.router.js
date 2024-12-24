const express = require("express");
let router = express.Router();
let multer = require("multer");
const path = require("path");

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/admin/dashboard", isAuthenticated, (req, res) => {
  res.render("admin/dashboard", { layout: "admin/admin-layout" });
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });
let Product = require("../../models/product.model");

router.get("/admin/products/delete/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  return res.redirect("back");
});

router.get("/admin/products/edit/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  return res.render("admin/product-edit-form", {
    product,
    layout: "admin/admin-layout",
  });
});

router.post("/admin/products/edit/:id", upload.single("file"), async (req, res) => {
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  product.isFeatured = Boolean(req.body.isFeatured);
  
  // Handle file upload
  if (req.file) {
    product.picture = req.file.filename; // Update the picture if a new file is uploaded
  }
  
  await product.save();
  return res.redirect("/admin/products");
});

router.get("/admin/products/create", (req, res) => {
  res.render("admin/product-form", { layout: "admin/admin-layout" });
});

router.post(
  "/admin/products/create",
  upload.single("file"), // Handle file upload
  async (req, res) => {
    let newProduct = new Product(req.body);
    if (req.file) newProduct.picture = req.file.filename; // Save the uploaded file name
    newProduct.isFeatured = Boolean(req.body.isFeatured);
    await newProduct.save();
    return res.redirect("/admin/products");
  }
);

router.get("/admin/products/:page?", async (req, res) => {
  let page = req.params.page ? Number(req.params.page) : 1;
  let pageSize = 2; // Number of products per page
  let searchQuery = req.query.search || ""; // Get the search query from the URL
  let sortBy = req.query.sortBy || 'title'; // Default sorting by title
  let sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default sorting order

  // Find products based on the search query
  let products = await Product.find({
    title: { $regex: searchQuery, $options: "i" } // Case-insensitive search
  })
    .sort({ [sortBy]: sortOrder }) // Sort by the selected field
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  let totalRecords = await Product.countDocuments({
    title: { $regex: searchQuery, $options: "i" }
  });
  let totalPages = Math.ceil(totalRecords / pageSize);

  res.render("admin/products", {
    layout: "admin/admin-layout",
    products,
    page,
    totalRecords,
    totalPages,
    searchQuery,
    sortBy,
    sortOrder
  });
});

module.exports = router;