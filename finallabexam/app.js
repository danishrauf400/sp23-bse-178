const express = require("express"); // Move express import to the top
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

let app = express(); // Create the express app

// Middleware
app.use(cookieParser());
app.use(session({ secret: "My session secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Import models and routes
const User = require("./models/user.model");
require("./config/passport"); // Import passport configuration
let authRouter = require("./routes/auth.router");
app.use(authRouter);


const wishlistRouter = require("./routes/wishlist.router");
app.use("/", wishlistRouter);

app.use(express.static("public"));
app.use(express.static("uploads"));
let ProductModel = require("./models/product.model");
app.use(express.urlencoded()); // Middleware to parse body data for form submission

// Setup view engine
app.set("view engine", "ejs");
app.use(expressLayouts);


app.get("/add-to-cart/:id", async (req, res) => {
  // Get the cart from cookies or initialize it
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  
  // Add the product ID to the cart
  cart.push(req.params.id);
  
  // Set the updated cart back to cookies
  res.cookie("cart", JSON.stringify(cart), { maxAge: 900000, httpOnly: true }); // 15 minutes expiration
  res.redirect("/"); // Redirect to the homepage or wherever you want
});

app.get("/cart", async (req, res) => {
  // Get the cart from cookies
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  
  // Fetch products based on the cart IDs
  let products = await ProductModel.find({ _id: { $in: cart } });
  
  // Render the cart view with the products
  return res.render("cart", { products });
});


// Add product routes
let productsRouter = require("./routes/admin/products.router");
app.use(productsRouter);

// Define application routes
app.get("/contact-us", (req, res) => {
  let address = "Lahore";
  let phone = "+12345";
  res.render("contact-us", { address, phone });
});

app.get("/add-to-cart/:id", async (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  res.redirect("/");
});

app.get("/cart", async (req, res) => {
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  let products = await ProductModel.find({ _id: { $in: cart } });
  return res.render("cart", { products });
});

app.get("/", async (req, res) => {
  let products = await ProductModel.find();
  res.render("home", { products });
});

// MongoDB connection
let connectionString = "mongodb://localhost:27017/sp23-bse-a";
mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.log(err.message);
  });

// Start the server
app.listen(5000, () => {
  console.log("Server started at localhost:5000");
});