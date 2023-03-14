
const users = require("../controllers/user.controller.js");

var router = require("express").Router();

    // Home route
router.get("/", (req, res) => {
    res.json({ message: "Welcome to Ecommerce-Team-Furebo project." });  
  });


// Create a new User
router.post("/create", users.create);

// Retrieve all Users
router.get("/users", users.findAll);

// Retrieve a single User with id
router.get("/users/:id", users.findOne);

// Update a User with id
router.put("/update/:id", users.update);

// Delete a User with id
router.delete("/delete/:id", users.delete);

// Create a new User
router.delete("/deleteall", users.deleteAll);

module.exports = router;
