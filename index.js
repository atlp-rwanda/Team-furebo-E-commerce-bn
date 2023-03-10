require("dotenv").config();
const express = require("express");
const db = require("./src/models");
const userRouter = require("./src/routes/user.routes");

const app = express();

app.use(express.json());


db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


app.use("/", userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
