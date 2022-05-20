require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

//consulta para registrar datos en Stock
async function agregar_stock(id_insumo, id_tipo_insumo, id_bodega, cantidad_en_stock) {
    try {
        const result = await pool.query("INSERT INTO stock (id_insumo, id_tipo_insumo, id_bodega, cantidad_en_stock) VALUES ($1, $2, $3, $4) RETURNING*;",
        [`${id_insumo}`, `${id_tipo_insumo}`, `${id_bodega}`, `${cantidad_en_stock}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

//consulta para extraer datos de tabla stock
async function obtener_stock() {
    try {
        const result = await pool.query("SELECT * FROM stock;")
        return result.rows
    } catch (e) {
        
    }
}

//transacción: adición de unidades al stock
async function agregar_unidades(id_insumo, cantidad_en_stock) {
    try {
        const result = await pool.query("UPDATE stock SET cantidad_en_stock = cantidad_en_stock + $2 WHERE id_insumo = $1 RETURNING*;",
        [`${id_insumo}`, `${cantidad_en_stock}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

//transaccion: reducción de unidades en stock
async function descontar_unidades(id_insumo, cantidad_en_stock) {
    try {
        const result = await pool.query("UPDATE stock SET cantidad_en_stock = cantidad_en_stock - $2 WHERE id_insumo = $1 RETURNING*;",
        [`${id_insumo}`, `${cantidad_en_stock}`]
        )
        return result.rows
    } catch (e) {
        return e
    }
}

module.exports = {agregar_stock, obtener_stock, agregar_unidades, descontar_unidades}