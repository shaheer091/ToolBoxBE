const express = require('express')
const router = express.Router()
const userController = require('../controller/user.controller')

router.get('/searchBook', userController.searchBook)
router.get('/translate', userController.translate)

module.exports= router;