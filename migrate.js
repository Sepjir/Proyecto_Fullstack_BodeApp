require('dotenv').config()
const fs = require('fs')

const { Client } = require('pg')

const migrate = async () => {
    const client = new Client()
    await client.connect()

    const sql = fs.readFileSync('./sql/db.sql').toString();
    const table = fs.readFileSync('./sql/table.sql').toString();

    const res = await client.query(sql)
    const res2 = await client.query(table)
    await client.end()
    return res.rows
}

migrate()