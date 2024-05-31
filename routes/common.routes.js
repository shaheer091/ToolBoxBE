const express = require('express')
const router = express.Router()
const commonController = require('../controller/common.controller')

router.post('/register', commonController.register)
router.post('/login', commonController.login)

module.exports = router