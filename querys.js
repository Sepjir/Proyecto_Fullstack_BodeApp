require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

//Consulta para obtener insumos
async function get_insumos() {
    try {
        const result = await pool.query("SELECT * FROM insumo ORDER BY id_insumo")
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para obtener las bodegas
async function get_bodegas() {
    try {
        const result = await pool.query("SELECT * FROM bodegas ORDER BY id_bodega")
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para agregar una bodega nueva
async function add_bodega(name) {
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
async function delete_bodega(id) {
    try {
        const result = await pool.query("DELETE FROM bodegas WHERE id_bodega=$1 RETURNING*;",
        [`${id}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para obtener datos de la tabla usuarios
async function get_users() {
    try {
        const result = await pool.query("SELECT * FROM usuarios;")
        return result.rows
    } catch (e) {
        
    }
}

//consulta para registrar usuarios en la tabla usuarios
async function add_user(type_user, name, lastname, email, password) {
    try {
        const result = await pool.query("INSERT INTO usuarios (id_tipo_usuario, nombre, apellido, mail, contrasena) VALUES ($1, $2, $3, $4, $5) RETURNING*;",
        [`${type_user}`, `${name}`, `${lastname}`, `${email}`, `${password}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}




module.exports = {get_insumos, get_bodegas, add_user, get_users, add_bodega, delete_bodega}