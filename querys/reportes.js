require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

//consultas datos para informe de ingresos y salidas de insumos
async function reporte_fechas_egresos(fecha, fecha2) {
    try {
        const result = await pool.query("SELECT egresos.id_egresos, insumo.nombre_de_insumo, tipo_de_insumo.tipo_de_insumo, bodegas.nombre_bodega, area.nombre_area, egresos.cantidad_saliente, egresos.persona_recibe, to_char(egresos.fecha_egreso, 'DD/MM/YYYY') FROM egresos INNER JOIN insumo ON (egresos.id_insumo = insumo.id_insumo) INNER JOIN tipo_de_insumo ON (egresos.id_tipo_insumo = tipo_de_insumo.id_tipo_insumo) INNER JOIN bodegas ON (egresos.id_bodega = bodegas.id_bodega) INNER JOIN area ON (egresos.id_area = area.id_area) WHERE fecha_egreso BETWEEN $1 AND $2 ORDER BY fecha_egreso;",
        [`${fecha}`, `${fecha2}`])
        return result.rows
    } catch (e) {
        return e
    }
}

async function reporte_fechas_ingresos(fecha, fecha2) {
    try {
        const result = await pool.query("SELECT ingresos.id_ingreso, insumo.nombre_de_insumo, tipo_de_insumo.tipo_de_insumo, bodegas.nombre_bodega, ingresos.unidades_ingresadas, to_char(ingresos.fecha_de_ingreso, 'DD/MM/YYYY') FROM ingresos INNER JOIN insumo ON (ingresos.id_insumo = insumo.id_insumo) INNER JOIN tipo_de_insumo ON (ingresos.id_tipo_insumo = tipo_de_insumo.id_tipo_insumo) INNER JOIN bodegas ON (ingresos.id_bodega = bodegas.id_bodega) WHERE fecha_de_ingreso BETWEEN $1 AND $2 ORDER BY fecha_de_ingreso;",
        [`${fecha}`, `${fecha2}`])
        return result.rows
    } catch (e) {
        return e
    }
}

//consultas para ver información de stock actual y stock critico
async function stock_actual() {
    try {
        const result = await pool.query("SELECT insumo.nombre_de_insumo, tipo_de_insumo.tipo_de_insumo, bodegas.nombre_bodega, stock.cantidad_en_stock FROM stock INNER JOIN insumo ON (stock.id_insumo = insumo.id_insumo) INNER JOIN tipo_de_insumo ON (stock.id_tipo_insumo = tipo_de_insumo.id_tipo_insumo) INNER JOIN bodegas ON (stock.id_bodega = bodegas.id_bodega) WHERE stock.cantidad_en_stock >= 20 ORDER BY nombre_de_insumo;")
        return result.rows
    } catch (e) {
        return e
    }
}

async function stock_critico() {
    try {
        const result = await pool.query("SELECT insumo.nombre_de_insumo, tipo_de_insumo.tipo_de_insumo, bodegas.nombre_bodega, stock.cantidad_en_stock FROM stock INNER JOIN insumo ON (stock.id_insumo = insumo.id_insumo) INNER JOIN tipo_de_insumo ON (stock.id_tipo_insumo = tipo_de_insumo.id_tipo_insumo) INNER JOIN bodegas ON (stock.id_bodega = bodegas.id_bodega) WHERE stock.cantidad_en_stock < 20 ORDER BY nombre_de_insumo;")
        return result.rows
    } catch (e) {
        return e
    }
}

module.exports = {reporte_fechas_egresos, reporte_fechas_ingresos, stock_actual, stock_critico}