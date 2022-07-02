const moment = require('moment')
const { v4: uuid } = require('uuid')
const { hashSync, compareSync } = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../services/authService')
const pool = require('../postgreSQL/pool')

let login = async (req, res) => {
    let { email, password } = req.body

    pool.query('SELECT * FROM public."Users" WHERE email = $1', [email])
        .then(async (results) => {
            if (results.rows.length === 0) {
                return res.status(401).send({
                    success: false,
                    message: 'User not found.'
                })
            } else if (!compareSync(password, results.rows[0].password)) {
                return res.status(401).send({
                    success: false,
                    message: 'Incorrect password.'
                })
            }

            let payload = {
                user_id: results.rows[0].user_id,
                name: results.rows[0].name
            }

            let token = generateAccessToken(payload)
            let refreshToken = generateRefreshToken(payload)

            pool.query('UPDATE public."Users" SET refresh_token = $1 WHERE user_id = $2 RETURNING *', [refreshToken, results.rows[0].user_id])
                .then(async (results) => {
                    return res.status(200).send({
                        success: true,
                        message: 'User logged in successfully.',
                        user: {
                            user_id: results.rows[0].user_id,
                            name: results.rows[0].name,
                            profile_picture: results.rows[0].profile_picture,
                        },
                        accessToken: "Bearer " + token,
                        refreshToken: refreshToken
                    })
                })
                .catch(async (err) => {
                    return res.status(500).send({
                        success: false,
                        message: 'Internal Server Error',
                        error: err.detail
                    })
                })
        }).catch(async (err) => {
            return res.status(500).send({
                success: false,
                message: 'Internal Server Error',
                error: err.detail
            })
        })
}

let register = async (req, res) => {
    let { name, email, password, profile_picture } = req.body
    let now = moment()

    pool.query('INSERT INTO public."Users" (user_id, name, email, password, profile_picture, date_joined) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [uuid(), name, email, hashSync(password, 10), profile_picture, now.format('YYYY-MM-DD HH:mm:ss Z')])
        .then(async (results) => {
            let payload = {
                user_id: results.rows[0].user_id,
                name: results.rows[0].name
            }

            let refreshToken = generateRefreshToken(payload)

            pool.query('UPDATE public."Users" SET refresh_token = $1 WHERE user_id = $2 RETURNING *', [refreshToken, results.rows[0].user_id])
                .then(async (results) => {
                    let token = generateAccessToken(payload)

                    return res.status(201).send({
                        success: true,
                        message: 'User created successfully.',
                        user: {
                            user_id: results.rows[0].user_id,
                            name: results.rows[0].name,
                            profile_picture: results.rows[0].profile_picture,
                        },
                        accessToken: "Bearer " + token,
                        refreshToken: refreshToken
                    })
                })
                .catch(async (err) => {
                    return res.status(500).send({
                        success: false,
                        message: 'Internal Server Error',
                        error: err.detail
                    })
                })
        }).catch(async (err) => {
            return res.status(500).send({
                success: false,
                message: 'Internal Server Error',
                error: err.detail
            })
        })
}

module.exports = { login, register }
