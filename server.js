//Express, rutas y handlebars
const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")
const {rutas} = require("./rutas/rutas")

//consultas a base de datos
const {obtener_insumos, obtener_tipo_insumos, obtener_tipo_insumos_y_nombre, add_insumo} = require("./querys/insumos")
const {obtener_bodegas, agregar_bodega, borrar_bodega} = require("./querys/bodegas")
const {obtener_usuarios, agregar_usuario, modificar_permiso_usuario} = require("./querys/usuarios")
const {obtener_areas, agregar_area, borrar_area} = require("./querys/area")
const {agregar_insumo, obtener_ingresos,agregar_entrega} = require("./querys/ingreso_egreso")
const {agregar_stock, obtener_stock, agregar_unidades, descontar_unidades} = require("./querys/stock")
const {reporte_fechas_egresos, reporte_fechas_ingresos, stock_actual, stock_critico} = require("./querys/reportes")

//JsonWebToken y llave
const jwt = require("jsonwebtoken")
const {llave} = require("./jwt/llave")

//configuración para extraer del body informacion
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//disponibilizar css de Bootstrap y carpeta public
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/js"))
app.use("/public", express.static(__dirname + "/public/"))

//configuración de Handlebars
app.set("view engine", "handlebars")
app.engine("handlebars", exphbs.engine({
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views/components"
}))

//ruta para el index de la aplicación
app.get(rutas.inicio, (req, res) => {
    res.render("inicio", {
        layout: "inicio",
    })
})

//ruta get para el inicio de sesión
app.get(rutas.ingreso, (req, res) => {
    res.render("ingreso", {
        layout: "ingreso"
    })
})

//ruta para identificar a los usuarios con JWT
app.get(rutas.verificar, async (req, res) => {
    const {email, contrasena} = req.query
    const users = await obtener_usuarios()
    const auth = users.find((s) => s.mail == email && s.contrasena == contrasena)
    if (!auth) {
        return res.status(401).send(`<script>alert("Email y/o contraseña no válidos"); window.location.href = "/login"</script>`)
    }if (auth.id_tipo_usuario == 2) {
        const token = jwt.sign({
            exp: Math.floor(Date.now()/ 1000) + 28800,
            data: auth
        }, llave)
        return res.send(`<script>alert("Bienvenido ${auth.nombre}, serás redirigido al control de inventario..."); window.location.href = "/bodeguero?token=${token}"</script>`)
    }if (auth.id_tipo_usuario == 1) {
        const token = jwt.sign({
            exp: Math.floor(Date.now()/ 1000) + 28800,
            data: auth
        }, llave)
        return res.send(`<script>alert("Bienvenido administrador, serás redirigido al control maestro"); window.location.href = "/admin?token=${token}"</script>`)
    }if (auth.id_tipo_usuario == 3) {
        return res.send(`<script>alert("Lo siento ${auth.nombre}, actualmente no tienes autorización"); window.location.href = "/login"</script>`)
    }
})

//ruta para registrar usuarios
app.get(rutas.registrar, (_, res) => {
    res.render("registrar", {
        layout: "registrar"
    })    
})

//ruta que registra efectivamente a los usuarios con metodo post
app.post(rutas.registrarUsuario, async (req, res) => {
    const {email, nombre, apellido, contrasena, contrasena2} = req.body
    const idTipo = 3
    if (contrasena == contrasena2) {
        await agregar_usuario(idTipo, nombre, apellido, email, contrasena)
        res.send(`<script>alert("El usuario ha sido creado éxitosamente"); window.location.href = "/"</script>`)
    } else {
        res.send(`<script>alert("Las contraseñas no coinciden. Vuelva a intentarlo"); window.location.href = "/registrar"</script>`)
    }
})

//ruta para vista de administrador verificado con JWT
app.get(rutas.admin, (req, res) => {
    const {token} = req.query
    jwt.verify(token, llave, (err, decoded) =>{
        if (!decoded) {
            return res.status(401).send(`<script>alert("No estás autorizado"); window.location.href = "/login"</script>`)
        }
        if (decoded.data.id_tipo_usuario == 1) {
            res.render("admin", {
                layout: "admin",
                token
            })
        }
    })
    
})

//ruta para vista de stock
app.get(rutas.stock, async (req, res) => {
    const {token} = req.query
    const stockActual = await stock_actual()
    const stockCritico = await stock_critico()
    res.render("stock", {
        layout: "stock",
        stockActual,
        stockCritico,
        token
    })
})

//ruta para vista como bodeguero autentificando el token
app.get(rutas.bodeguero, (req, res) => {
    const {token} = req.query
    jwt.verify(token, llave, (err, decoded) =>{
        if (!decoded) {
            return res.status(401).send(`<script>alert("No estás autorizado"); window.location.href = "/login"</script>`)
        }
        if (decoded.data.id_tipo_usuario == 2) {
            res.render("bodeguero", {
                layout: "bodeguero",
                token
            }) 
        }
    })
})

//ruta vista para ingresar mercadería a la bodega
app.get(rutas.recepcion, async (_, res) => {
    const insumos = await obtener_insumos()
    const bodegas = await obtener_bodegas()
    res.render("recepcion", {
        layout: "recepcion",
        insumos,
        bodegas
    })
})

//ruta con metodo post para ingresar mercadería a las bodegas
app.post(rutas.recepcion_insumos, async (req, res) => {
    const {insumo, bodega, cantidad, date} = req.body
    const nombreTipo = await obtener_tipo_insumos_y_nombre()
    const nombreBodega = await obtener_bodegas()
    const stock = await obtener_stock()
    const encontrarId = nombreTipo.find((i) => insumo == i.nombre_de_insumo)
    const encontrarBodega = nombreBodega.find((s) => bodega == s.id_bodega)
    const encontrarStock = stock.find((st) => st.id_insumo == encontrarId.id_insumo)
    if (!encontrarStock) {
        await agregar_stock(encontrarId.id_insumo, encontrarId.id_tipo_insumo, bodega, cantidad)
        await agregar_insumo(encontrarId.id_insumo, encontrarId.id_tipo_insumo, bodega, cantidad, date)
        return res.send(`<script>alert("Se han ingresado a la bodega '${encontrarBodega.nombre_bodega}' ${cantidad} unidades de '${insumo}' de forma exitosa"); window.location.href = "/recepcion"</script>`)
    }
    if (encontrarStock.id_bodega != bodega) {
        return res.send(`<script>alert("La bodega para el insumo '${insumo}' es la BODEGA ${encontrarStock.id_bodega} y haz elegido la BODEGA ${bodega}, vuelve a intentarlo"); window.location.href = "/recepcion"</script>`)
    }
    if (encontrarStock) {
        await agregar_insumo(encontrarId.id_insumo, encontrarId.id_tipo_insumo, bodega, cantidad, date)
        await add_units(encontrarId.id_insumo, cantidad)
        return res.send(`<script>alert("Se han ingresado a la bodega '${encontrarBodega.nombre_bodega}' ${cantidad} unidades de '${insumo}' de forma exitosa"); window.location.href = "/recepcion"</script>`)
    }
})

//ruta para vista de entrega de insumos
app.get(rutas.entregarInsumo, async (req, res) => {
    const insumos = await obtener_insumos()
    const areas = await obtener_areas()
    res.render("entrega" ,{
        layout: "entrega",
        insumos,
        areas
    })
})

//ruta POST para entregar insumos a departamentos
app.post(rutas.entregarInsumos, async (req, res) => {
    const {insumo, cantidad, area, nombre, fecha} = req.body
    const areas = await obtener_areas()
    const nombreBodega = await obtener_bodegas()
    const nombreTipo = await obtener_tipo_insumos_y_nombre()
    const ingresos = await obtener_ingresos()
    const stock = await obtener_stock()
    const encontrarNombreTipo = nombreTipo.find((s) => s.nombre_de_insumo == insumo)
    const encontrarIdIngresos = ingresos.find((i) => i.id_insumo == encontrarNombreTipo.id_insumo)
    const encontrarNombreArea = areas.find((a) => a.id_area == area)
    const encontrarStock = stock.find((st) => st.id_insumo == encontrarIdIngresos.id_insumo)
    const encontrarBodega = nombreBodega.find((store) => store.id_bodega == encontrarIdIngresos.id_bodega)
    if (!encontrarStock) {
        res.send(`<script>alert("No existe el insumo '${insumo}' en bodega"); window.location.href = "/deliver"</script>`)
    }if (encontrarStock && encontrarStock.cantidad_en_stock < cantidad) {
        res.send(`<script>alert("No hay suficientes unidades de '${insumo}' en bodega sólo hay '${encontrarIdIngresos.unidades_ingresadas}' unidades"); window.location.href = "/deliver"</script>`)
    }if (encontrarStock && encontrarStock.cantidad_en_stock > cantidad) {
        await agregar_entrega(encontrarNombreTipo.id_insumo, encontrarNombreTipo.id_tipo_insumo, encontrarBodega.id_bodega, area, cantidad, nombre, date)
        await descontar_unidades(encontrarNombreTipo.id_insumo, cantidad)
        res.send(`<script>alert("Se han entregado ${cantidad} unidades de '${insumo}' para el departamento de '${encontrarNombreArea.nombre_area}' y han sido retiradas por '${nombre}'"); window.location.href = "/deliver"</script>`)
    }

})

//ruta para vista que añade una nueva area/departamento
app.get(rutas.agregarArea, async(req, res) => {
    const areas = await obtener_areas()
    res.render("agregar_area", {
        layout: "agregar_area",
        areas
    })
})

//ruta post para añadir un nuevo departamento
app.post(rutas.agregarArea, async(req, res) => {
    const {area} = req.body
    const areaMayuscula = area.toUpperCase()
    await agregar_area(areaMayuscula)
    res.send(`<script>alert("El departamento '${areaMayuscula}' se ha añadido exitosamente"); window.location.href = "/agregar_area"</script>`)
})

//ruta para borrar un departamento
app.get(rutas.borrarArea, async(req, res) => {
    const {id} = req.params
    await borrar_area(id)
    res.send(`<script>alert("El departamento con id '${id}' se ha eliminado exitosamente"); window.location.href = "/agregar_area"</script>`)
})

//ruta para la vista de añadir insumos a la lista general
app.get(rutas.agregarInsumo, async (req, res) => {
    const insumos = await obtener_tipo_insumos_y_nombre()
    const tipoInsumo = await obtener_tipo_insumos()
    res.render("agregar_insumos", {
        layout: "agregar_insumos",
        insumos,
        tipoInsumo
    })
})

//ruta post para añadir un insumo a la lista general
app.post(rutas.agregarInsumos, async (req, res) => {
    const {nombre_insumo, tipo} = req.body
    const insumoMayuscula = nombre_insumo.toUpperCase()
    await add_insumo(tipo, insumoMayuscula)
    res.send(`<script>alert("El insumo '${insumoMayuscula}' se ha añadido exitosamente"); window.location.href = "/agregar_insumo"</script>`)
})

//ruta para vista de sección para agregar bodegas
app.get(rutas.agregarBodega, async (req, res) => {
    const bodegas = await obtener_bodegas()
    res.render("agregar_bodegas", {
        layout: "agregar_bodegas",
        bodegas
    })
})

//ruta para agregar bodegas
app.post(rutas.agregarBodegas, async (req, res) =>{
    const {bodega} = req.body
    const bodegaMayuscula = bodega.toUpperCase()
    await agregar_bodega(bodegaMayuscula)
    res.send(`<script>alert("La bodega '${bodegaMayuscula}' se ha añadido exitosamente"); window.location.href = "/agregar_bodega"</script>`)
})

//ruta para borrar una bodega
app.get(rutas.borrarBodega, async(req, res) =>{
    const {id} = req.params
    await borrar_bodega(id)
    res.send(`<script>alert("La bodega con id '${id}' se ha borrado exitosamente"); window.location.href = "/agregar_bodega"</script>`)
})

//ruta para vista de reporte por rango de fechas
app.get(rutas.formularioReporte, (req, res) => {
    res.render("reporte", {
        layout: "reporte"
    })
})

//vista para detalle del reporte de inventario
app.get(rutas.reporteEnDetalle, async (req, res) =>{
    const {fecha, fecha2} = req.query
    const ingresosPorFecha = await reporte_fechas_ingresos(fecha, fecha2)
    const egresosPorFecha = await reporte_fechas_egresos(fecha, fecha2)
    res.render("detalle_reporte", {
        layout: "detalle_reporte",
        ingresosPorFecha,
        egresosPorFecha
    })
})

//Vista para dar permisos a nuevos usuarios, admin o bodeguero
app.get(rutas.darPermisos, async (req, res) => {
    const usuarios = await obtener_usuarios()
    res.render("dar_permisos", {
        layout: "dar_permisos",
        usuarios
    })
})

//lógica para dar permisos a usuarios registrados mediante metodo PUT
app.get(rutas.cambiarPermiso, async (req, res) => {
    const{id, permiso} = req.query
    await modificar_permiso_usuario(id, permiso)
    res.send(`<script>window.location.href = "/permisos"</script>`)

})


app.listen(port, () => console.log(`Servidor levantado en la dirección http://localhost:${port}`))