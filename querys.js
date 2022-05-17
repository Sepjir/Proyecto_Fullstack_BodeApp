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

//consulta para obtener tipo de insumo
async function get_tipo_insumos() {
    try {
        const result = await pool.query("SELECT * FROM tipo_de_insumo ORDER BY id_tipo_insumo")
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta INNER JOIN para obtener los insumos y su tipo
async function get_tipo_insumos_and_name() {
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

//consulta para obtener datos de departamentos
async function get_areas() {
    try {
        const result = await pool.query("SELECT * FROM area;")
        return result.rows
    } catch (e) {
        
    }
}

//consulta para añadir nuevos departamentos
async function add_area(area) {
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
async function delete_area(id) {
    try {
        const result = await pool.query("DELETE FROM area WHERE id_area=$1 RETURNING*;",
        [`${id}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}



module.exports = {get_insumos, get_bodegas, add_user, get_users, add_bodega, delete_bodega, get_areas, add_area, delete_area, get_tipo_insumos, get_tipo_insumos_and_name, add_insumo}