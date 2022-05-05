require('dotenv').config()
const fs = require('fs')

const { Client } = require('pg')

const migrate = async () => {
    const client = new Client()
    await client.connect()

    const sql = fs.readFileSync('db.sql').toString();

    const res = await client.query(sql)
    await client.end()
    return res.rows
}

migrate()