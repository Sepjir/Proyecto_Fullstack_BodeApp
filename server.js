const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")

const {
    get_insumos,
    get_bodegas,
    add_user,
    get_users,
    add_bodega,
    delete_bodega,
    get_areas,
    add_area,
    delete_area,
    get_tipo_insumos,
    get_tipo_insumos_and_name,
    add_insumo,
    add_supply,
    get_ingresos,
    add_deliver} = require("./querys")

const jwt = require("jsonwebtoken")
const {key} = require("./jwt/key")

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
app.get("/", (_, res) => {
    res.render("index", {
        layout: "index",
    })
})

//ruta get para el inicio de sesión
app.get("/login", (_, res) => {
    res.render("login", {
        layout: "login"
    })
})

//ruta para identificar a los usuarios con JWT
app.get("/verifylogin", async (req, res) => {
    const {email, contrasena} = req.query
    const users = await get_users()
    const auth = users.find((s) => s.mail == email && s.contrasena == contrasena)
    if (!auth) {
        return res.status(401).send(`<script>alert("Email y/o contraseña no válidos"); window.location.href = "/login"</script>`)
    }if (auth.id_tipo_usuario == 2) {
        const token = jwt.sign({
            exp: Math.floor(Date.now()/ 1000) + 28800,
            data: auth
        }, key)
        return res.send(`<script>alert("Bienvenido ${auth.nombre}, serás redirigido al control de inventario..."); window.location.href = "/storekeeper?token=${token}"</script>`)
    }if (auth.id_tipo_usuario == 1) {
        const token = jwt.sign({
            exp: Math.floor(Date.now()/ 1000) + 28800,
            data: auth
        }, key)
        return res.send(`<script>alert("Bienvenido administrador, serás redirigido al control maestro"); window.location.href = "/admin?token=${token}"</script>`)
    }if (auth.id_tipo_usuario == 3) {
        return res.send(`<script>alert("Lo siento ${auth.nombre}, actualmente no tienes autorización"); window.location.href = "/login"</script>`)
    }
})

//ruta para registrar usuarios
app.get("/signon", (_, res) => {
    res.render("signon", {
        layout: "signon"
    })    
})

//ruta que registra efectivamente a los usuarios con metodo post
app.post("/adduser", async (req, res) => {
    const {email, name, lastname, password, password2} = req.body
    const idType = 3
    console.log(email, name, lastname, password,idType)
    if (password == password2) {
        await add_user(idType, name, lastname, email, password)
        res.send(`<script>alert("El usuario ha sido creado éxitosamente"); window.location.href = "/"</script>`)
    } else {
        res.send(`<script>alert("Las contraseñas no coinciden. Vuelva a intentarlo"); window.location.href = "/signon"</script>`)
    }
})

//ruta para vista de administrador verificado con JWT
app.get("/admin", (req, res) => {
    const {token} = req.query
    jwt.verify(token, key, (err, decoded) =>{
        if (!decoded) {
            return res.status(401).send(`<script>alert("No estás autorizado"); window.location.href = "/login"</script>`)
        }
        if (decoded.data.id_tipo_usuario == 1) {
            res.render("admin", {
                layout: "admin"
            })
        }
    })
    
})

//ruta para vista de stock
app.get("/stock", (_, res) => {
    res.render("stock", {
        layout: "stock"
    })
})

//ruta para vista como bodeguero autentificando el token
app.get("/storekeeper", (req, res) => {
    const {token} = req.query
    jwt.verify(token, key, (err, decoded) =>{
        if (!decoded) {
            return res.status(401).send(`<script>alert("No estás autorizado"); window.location.href = "/login"</script>`)
        }
        if (decoded.data.id_tipo_usuario == 2) {
            res.render("store_keeper", {
                layout: "store_keeper"
            }) 
        }
    })
})

//ruta vista para ingresar mercadería a la bodega
app.get("/reception", async (_, res) => {
    const insumos = await get_insumos()
    const bodegas = await get_bodegas()
    res.render("reception", {
        layout: "reception",
        insumos,
        bodegas
    })
})

//ruta con metodo post para ingresar mercadería a las bodegas
app.post("/add_stock", async (req, res) => {
    const {name, storehouse, units, date} = req.body
    const nameAndType = await get_tipo_insumos_and_name()
    const storehouseName = await get_bodegas()
    const findId = nameAndType.find((i) => name == i.nombre_de_insumo)
    const findStorehouse = storehouseName.find((s) => storehouse == s.id_bodega)
    await add_supply(findId.id_insumo, findId.id_tipo_insumo, storehouse, units, date)
    res.send(`<script>alert("Se han ingresado a la bodega '${findStorehouse.nombre_bodega}' ${units} unidades de '${name}' de forma exitosa"); window.location.href = "/reception"</script>`)
})

//ruta para vista de entrega de insumos
app.get("/deliver", async (req, res) => {
    const insumos = await get_insumos()
    const areas = await get_areas()
    res.render("deliver" ,{
        layout: "deliver",
        insumos,
        areas
    })
})

//ruta POST para entregar insumos a departamentos
app.post("/deliver_items", async (req, res) => {
    const {product, units, area, name, date} = req.body
    const areas = await get_areas()
    storehouseName = await get_bodegas()
    const nameAndType = await get_tipo_insumos_and_name()
    const ingresos = await get_ingresos()
    const findNameAndType = nameAndType.find((s) => s.nombre_de_insumo == product)
    const findIdIngresos = ingresos.find((i) => i.id_insumo == findNameAndType.id_insumo)
    const findNameArea = areas.find((a) => a.id_area == area)
    const findStorehouse = storehouseName.find((store) => store.id_bodega == findIdIngresos.id_bodega)
    if (!findIdIngresos) {
        res.send(`<script>alert("No existe el insumo '${product}' en bodega"); window.location.href = "/deliver"</script>`)
    }if (findIdIngresos && findIdIngresos.unidades_ingresadas < units) {
        res.send(`<script>alert("No hay suficientes unidades de '${product}' en bodega sólo hay '${findIdIngresos.unidades_ingresadas}' unidades"); window.location.href = "/deliver"</script>`)
    }if (findIdIngresos && findIdIngresos.unidades_ingresadas > units) {
        await add_deliver(findNameAndType.id_insumo, findNameAndType.id_tipo_insumo, findStorehouse.id_bodega, area, units, name, date)
        res.send(`<script>alert("Se han entregado ${units} unidades de '${product}' para el departamento de '${findNameArea.nombre_area}' y han sido retiradas por '${name}'"); window.location.href = "/deliver"</script>`)
    }

})

//ruta para vista que añade una nueva area/departamento
app.get("/add_area", async(req, res) => {
    const areas = await get_areas()
    res.render("add_areas", {
        layout: "add_areas",
        areas
    })
})

//ruta post para añadir un nuevo departamento
app.post("/add_area", async(req, res) => {
    const {area} = req.body
    const areaUpperCase = area.toUpperCase()
    await add_area(areaUpperCase)
    res.send(`<script>alert("El departamento '${areaUpperCase}' se ha añadido exitosamente"); window.location.href = "/add_area"</script>`)
})

//ruta para borrar un departamento
app.get("/delete_area/:id", async(req, res) => {
    const {id} = req.params
    await delete_area(id)
    res.send(`<script>alert("El departamento con id '${id}' se ha eliminado exitosamente"); window.location.href = "/add_area"</script>`)
})



//ruta para la vista de añadir insumos a la lista general
app.get("/add_items", async(req, res) => {
    const insumos = await get_tipo_insumos_and_name()
    const tipoInsumo = await get_tipo_insumos()
    res.render("add_items", {
        layout: "add_items",
        insumos,
        tipoInsumo
    })
})

//ruta post para añadir un insumo a la lista general
app.post("/add_item", async (req, res) => {
    const {item, type} = req.body
    const itemUppercase = item.toUpperCase()
    await add_insumo(type, itemUppercase)
    res.send(`<script>alert("El insumo '${itemUppercase}' se ha añadido exitosamente"); window.location.href = "/add_items"</script>`)
})

//ruta para vista de sección para agregar bodegas
app.get("/add_storehouse", async (req, res) => {
    const bodegas = await get_bodegas()
    res.render("add_storehouse", {
        layout: "add_storehouse",
        bodegas
    })
})

//ruta para agregar bodegas
app.post("/add_storehouses", async (req, res) =>{
    const {bodega} = req.body
    const bodegaUpperCase = bodega.toUpperCase()
    await add_bodega(bodegaUpperCase)
    res.send(`<script>alert("La bodega '${bodegaUpperCase}' se ha añadido exitosamente"); window.location.href = "/add_storehouse"</script>`)
})

app.get("/delete_storehouse/:id", async(req, res) =>{
    const {id} = req.params
    await delete_bodega(id)
    res.send(`<script>alert("La bodega con id '${id}' se ha borrado exitosamente"); window.location.href = "/add_storehouse"</script>`)
})

//ruta para vista de reporte mensual
app.get("/monthly", (req, res) => {
    res.render("monthly_report", {
        layout: "monthly_report"
    })
})

//ruta para vista de reporte semanal
app.get("/weekly", (req, res) => {
    res.render("weekly_report", {
        layout: "weekly_report"
    })
})

//ruta para vista de reporte diario
app.get("/daily", (req, res) => {
    res.render("daily_report", {
        layout: "daily_report"
    })
})

app.listen(port, () => console.log(`Servidor levantado en la dirección http://localhost:${port}`))