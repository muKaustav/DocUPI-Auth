require('dotenv').config()
const jwt = require('jsonwebtoken')
const pool = require('../postgreSQL/pool')

let generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

let generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
}

let refresh = (req, res) => {
    let refreshToken = req.body.token

    if (!refreshToken) {
        return res.status(401).send({
            success: false,
            message: 'No refresh token provided.'
        })
    }

    pool.query('SELECT * FROM public."Users" WHERE refresh_token = $1', [refreshToken])
        .then(async (results) => {
            if (results.rows.length === 0) {
                return res.status(403).send({
                    success: false,
                    message: 'User not found.'
                })
            } else {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(403).send({
                            success: false,
                            message: 'Invalid refresh token.'
                        })
                    } else {
                        let accessToken = generateAccessToken({ user_id: decoded.user_id, name: decoded.name })
                        return res.status(200).send({
                            success: true,
                            accessToken: "Bearer " + accessToken
                        })
                    }
                })
            }
        })
        .catch(async (err) => {
            console.log(err)
            return res.status(500).send({
                success: false,
                message: 'Internal Server Error',
                error: err.detail
            })
        })
}

module.exports = { generateAccessToken, generateRefreshToken, refresh }
