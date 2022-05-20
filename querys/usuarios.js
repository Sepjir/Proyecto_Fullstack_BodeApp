require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

//consulta para obtener datos de la tabla usuarios
async function obtener_usuarios() {
    try {
        const result = await pool.query("SELECT * FROM usuarios ORDER BY id_usuario;")
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para registrar usuarios en la tabla usuarios
async function agregar_usuario(type_user, name, lastname, email, password) {
    try {
        const result = await pool.query("INSERT INTO usuarios (id_tipo_usuario, nombre, apellido, mail, contrasena) VALUES ($1, $2, $3, $4, $5) RETURNING*;",
        [`${type_user}`, `${name}`, `${lastname}`, `${email}`, `${password}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para modificar permisos de un usuario registrado
async function modificar_permiso_usuario(id, id_tipo_usuario) {
    try {
        const result = await pool.query("UPDATE usuarios SET id_tipo_usuario = $2 WHERE id_usuario = $1 RETURNING*;",
        [`${id}`, `${id_tipo_usuario}`])
        return result.rows
    } catch (e) {
        return e
    }
}

module.exports = {obtener_usuarios, agregar_usuario, agregar_usuario, modificar_permiso_usuario}