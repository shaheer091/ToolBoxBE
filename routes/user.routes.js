const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller')

router.get('/searchBook', userController.searchBook)
router.get('/translate', userController.translate)
router.get('/getSchedule', userController.getSheduledTasks)
router.get('/weather', userController.getWeather)

router.post('/schedule', userController.scheduleReminder)

module.exports= router;