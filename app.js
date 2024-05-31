const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
app.use(express.json());
const userRoute = require("./routes/user.routes");
const commonRoute = require("./routes/common.routes");
const database = require("./utility/database");

app.use("/", commonRoute);
app.use("/user", userRoute);

database();

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
