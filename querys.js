require('dotenv').config()

const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
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

//consulta para obtener datos de la tabla usuarios
async function get_users() {
    try {
        const result = await pool.query("SELECT * FROM usuarios ORDER BY id_usuario;")
        return result.rows
    } catch (e) {
        
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

//consulta para añadir ingresos a la tabla ingresos
async function add_supply(id_insumo, id_tipo_insumo, id_bodega, unidades, fecha) {
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

//consulta para registrar datos en Stock
async function add_stock(id_insumo, id_tipo_insumo, id_bodega, cantidad_en_stock) {
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
async function add_units(id_insumo, cantidad_en_stock) {
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
        const result = await pool.query("SELECT insumo.nombre_de_insumo, tipo_de_insumo.tipo_de_insumo, bodegas.nombre_bodega, stock.cantidad_en_stock FROM stock INNER JOIN insumo ON (stock.id_insumo = insumo.id_insumo) INNER JOIN tipo_de_insumo ON (stock.id_tipo_insumo = tipo_de_insumo.id_tipo_insumo) INNER JOIN bodegas ON (stock.id_bodega = bodegas.id_bodega) WHERE stock.cantidad_en_stock > 20 ORDER BY nombre_de_insumo;")
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


module.exports = {
    obtener_insumos,
    obtener_bodegas,
    agregar_bodega,
    agregar_usuario,
    get_users,
    modificar_permiso_usuario,
    borrar_bodega,
    obtener_areas,
    agregar_area,
    borrar_area,
    obtener_tipo_insumos,
    obtener_tipo_insumos_y_nombre,
    add_insumo,
    add_supply,
    obtener_ingresos,
    agregar_entrega,
    obtener_stock,
    add_stock,
    add_units,
    descontar_unidades,
    reporte_fechas_egresos,
    reporte_fechas_ingresos,
    stock_actual,
    stock_critico}