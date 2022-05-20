require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

//consulta para obtener datos de departamentos
async function obtener_areas() {
    try {
        const result = await pool.query("SELECT * FROM area;")
        return result.rows
    } catch (e) {
        
    }
}

//consulta para añadir nuevos departamentos
async function agregar_area(area) {
    try {
        const result = await pool.query("INSERT INTO area (nombre_area) VALUES ($1) RETURNING*;",
        [`${area}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para borrar departamentos
async function borrar_area(id) {
    try {
        const result = await pool.query("DELETE FROM area WHERE id_area=$1 RETURNING*;",
        [`${id}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

module.exports = {obtener_areas, agregar_area, borrar_area}