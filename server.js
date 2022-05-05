const express = require("express")
const app = express()
const port = 3000

const exphbs = require("express-handlebars")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/css"))
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist/js"))
app.use("/public", express.static(__dirname + "/public/"))

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
app.get("/login", (req, res) => {
    res.render("login", {
        layout: "login"
    })
})

app.listen(port, () => console.log(`Servidor levantado en la dirección http://localhost:${port}`))