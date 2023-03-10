
const users = require("../controllers/user.controller.js");
const router = require("express").Router();

  // Create a new User
  router.post("/create", users.create);
  // // LOGIN
  // router.post("/login", users.login);

  // Delete all Users
  router.delete("/deleteall", users.deleteAll);

module.exports=router;
