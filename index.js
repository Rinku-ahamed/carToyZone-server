const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Car Toy Zone server running");
});

app.listen(port, () => {
  console.log("Car toy zone server running port is", port);
});
