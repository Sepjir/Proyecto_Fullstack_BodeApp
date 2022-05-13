const express = require("express")
const app = express()
const port = 3000
const exphbs = require("express-handlebars")

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

//ruta para registrar usuarios
app.get("/signon", (_, res) => {
    res.render("signon", {
        layout: "signon"
    })    
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

//ruta para vista como bodeguero
app.get("/storekeeper", (_, res) => {
    res.render("store_keeper", {
        layout: "store_keeper"
    })
})

//ruta vista para ingresar mercadería a la bodega
app.get("/reception", (_, res) => {
    res.render("reception", {
        layout: "reception"
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

//ruta para la vista de añadi insumos a la lista general
app.get("/add_items", (req, res) => {
    res.render("add_items", {
        layout: "add_items"
    })
})

//ruta para vista de sección para agregar bodegas
app.get("/add_storehouse", (req, res) => {
    res.render("add_storehouse", {
        layout: "add_storehouse"
    })
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

app.listen(port, () => console.log(`Servidor levantado en la dirección http://localhost:${port}`))