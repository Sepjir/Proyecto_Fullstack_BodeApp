require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

//Consulta para obtener insumos
async function obtener_insumos() {
    try {
        const result = await pool.query("SELECT * FROM insumo ORDER BY id_insumo")
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para obtener tipo de insumo
async function obtener_tipo_insumos() {
    try {
        const result = await pool.query("SELECT * FROM tipo_de_insumo ORDER BY id_tipo_insumo")
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta INNER JOIN para obtener los insumos y su tipo
async function obtener_tipo_insumos_y_nombre() {
    try {
        const result = await pool.query("SELECT * FROM insumo INNER JOIN tipo_de_insumo ON insumo.id_tipo_insumo = tipo_de_insumo.id_tipo_insumo ORDER BY id_insumo;")
        return result.rows
    } catch (e) {
        return e
    }
}

// consulta para agregar nuevos insumos a la lista general
async function add_insumo(type, name) {
    try {
        const result = await pool.query("INSERT INTO insumo (id_tipo_insumo ,nombre_de_insumo) VALUES ($1, $2) RETURNING*;",
        [`${type}`, `${name}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

module.exports = {obtener_insumos, obtener_tipo_insumos, obtener_tipo_insumos_y_nombre, add_insumo}