const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
const port = process.env.PORT

// Import Routes
const userRoute = require("./routes/user.routes");
const commonRoute = require("./routes/common.routes");

// Import Database Utility
const database = require("./utility/database");

// Middleware Setup
app.use(cors());
app.use(express.json());

// Route Setup
app.use("/", commonRoute);
app.use("/user", userRoute);

// Connect to Database
database();

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
