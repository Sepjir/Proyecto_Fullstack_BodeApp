require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

//consulta para añadir ingresos a la tabla ingresos
async function agregar_insumo(id_insumo, id_tipo_insumo, id_bodega, unidades, fecha) {
    try {
        const result = await pool.query("INSERT INTO ingresos (id_insumo, id_tipo_insumo, id_bodega, unidades_ingresadas, fecha_de_ingreso) VALUES ($1, $2, $3, $4, $5) RETURNING*;",
        [`${id_insumo}`, `${id_tipo_insumo}`, `${id_bodega}`, `${unidades}`, `${fecha}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para obtener información de la tabla ingresos
async function obtener_ingresos() {
    try {
        const result = await pool.query("SELECT * FROM ingresos;")
        return result.rows
    } catch (e) {
        
    }
}

//consulta para agregar información a la tabla egresos de mercaderia
async function agregar_entrega(id_insumo, id_tipo_insumo, id_bodega, id_area, unidades, quienRetiro, fecha) {
    try {
        const result = await pool.query("INSERT INTO egresos (id_insumo, id_tipo_insumo, id_area, id_bodega, cantidad_saliente, persona_recibe, fecha_egreso) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING*;",
        [`${id_insumo}`, `${id_tipo_insumo}`,`${id_area}`, `${id_bodega}`, `${unidades}`, `${quienRetiro}`, `${fecha}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

module.exports = {agregar_insumo, obtener_ingresos,agregar_entrega}