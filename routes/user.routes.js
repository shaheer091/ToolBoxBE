const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const {verifyToken} = require("../utility/jwt.controller");

router.get("/searchBook", userController.searchBook);
router.get("/translate", userController.translate);
router.get("/getSchedule", verifyToken, userController.getSheduledTasks);
router.get("/weather", userController.getWeather);
router.get("/getNews", userController.getNews);

router.post("/schedule", verifyToken, userController.scheduleReminder);

module.exports = router;
