const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")
const {get_insumos, get_bodegas, add_user, get_users, add_bodega, delete_bodega} = require("./querys")
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

//ruta para vista de administrador
app.get("/admin", (_, res) => {
    res.render("admin", {
        layout: "admin"
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
                layout: "store_keeper",
                token
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

//ruta para vista de entrega de insumos
app.get("/deliver", (req, res) => {
    res.render("deliver" ,{
        layout: "deliver"
    })
})

//ruta para vista que añade una nueva area para recibir insumos
app.get("/add_area", (req, res) => {
    res.render("add_areas", {
        layout: "add_areas"
    })
})

//ruta para la vista de añadir insumos a la lista general
app.get("/add_items", (req, res) => {
    res.render("add_items", {
        layout: "add_items"
    })
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
    const {area} = req.body
    await add_bodega(area)
    res.send(`<script>alert("La bodega '${area}' se ha añadido exitosamente"); window.location.href = "/add_storehouse"</script>`)
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