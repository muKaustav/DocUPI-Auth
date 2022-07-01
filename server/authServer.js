require('dotenv').config()
const cors = require('cors')
const express = require('express')
const authRoute = require('./routes/auth')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

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