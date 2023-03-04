require ('dotenv').config()
const express = require('express')
const port = 3001
const app = express()
const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASS,
    port: process.env.POSTGRES_PORT
})

app.get('/api/data', async (req, res) => {
    let limit = req.query.limit
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    try {
        const { rows } = await pool.query(`SELECT id, name, price, image FROM items ORDER BY random()LIMIT ${limit}`)
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.get('/', (req, res) => {
    res.send(pool)
})
app.listen(port, () => {
    console.log(`app listening on ${port}`)
})