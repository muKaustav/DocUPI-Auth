require('dotenv').config()
const { Pool } = require('pg')

module.exports = new Pool({
    connectionString: process.env.DATABASE_URL,
    port: process.env.PG_PORT,
    max: 20,
    connectionTimeoutMillis: 0,
    idleTimeoutMillis: 0,
    ssl: {
        rejectUnauthorized: false
    }
})