require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

//consulta para obtener las bodegas
async function obtener_bodegas() {
    try {
        const result = await pool.query("SELECT * FROM bodegas ORDER BY id_bodega")
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para agregar una bodega nueva
async function agregar_bodega(name) {
    try {
        const result = await pool.query("INSERT INTO bodegas (nombre_bodega) VALUES ($1) RETURNING*;",
        [`${name}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para borrar bodegas
async function borrar_bodega(id) {
    try {
        const result = await pool.query("DELETE FROM bodegas WHERE id_bodega=$1 RETURNING*;",
        [`${id}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

module.exports = {obtener_bodegas, agregar_bodega, borrar_bodega}