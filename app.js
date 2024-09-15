const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "66e5fb53cac954bb142bb4d9",
  };
  next();
});

app.use(express.json());
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
