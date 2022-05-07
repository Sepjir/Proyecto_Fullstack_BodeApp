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
app.get("/admin", (req, res) => {
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
app.get("/storekeeper", (req, res) => {
    res.render("store_keeper", {
        layout: "store_keeper"
    })
})

app.listen(port, () => console.log(`Servidor levantado en la dirección http://localhost:${port}`))