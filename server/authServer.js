require('dotenv').config()
const path = require('path')
const cors = require('cors')
const express = require('express')
const favicon = require('serve-favicon')
const authRoute = require('./routes/auth')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, './assets', 'favicon.png')))

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the DocUPI Authentication API Subsystem',
        time: new Date().toLocaleString(),
        ip: req.ip
    })
})

app.use('/auth', authRoute)

app.get('*', (req, res) => {
    res.redirect('/')
})

PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`)
})