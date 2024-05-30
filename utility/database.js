const mongoose = require("mongoose");
require("dotenv").config();

const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.DB_URL);
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database", error);
      throw error;
    }
  }
};

module.exports = connectToDatabase