const express = require('express')
const { login, register } = require('../controllers/user')
const { refresh } = require('../services/authService')

const router = express.Router()

router.get('/', login)
router.post('/', register)

router.get('/refresh', refresh)

module.exports = router