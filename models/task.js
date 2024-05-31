const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  email: String,
  task: String,
  time: String,
});

module.exports = mongoose.model("tasks", taskSchema);
