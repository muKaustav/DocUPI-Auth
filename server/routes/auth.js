const express = require('express')
const { login, register } = require('../controllers/auth')
const { refresh, deleteRefresh } = require('../services/authService')

const router = express.Router()

router.get('/', login)
router.post('/', register)

router.get('/refresh', refresh)
router.delete('/refresh', deleteRefresh)

module.exports = router