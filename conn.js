const express = require("express")
const ExpressHandlebars = require('express-handlebars')
const session = require("express-session")
const flash = require("connect-flash")
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const routes = require("./routes/routes")
const usuarios = require("./routes/users")
const passport = require("passport")
const path = require("path")
const app = express()

require("./config/auth")(passport)

require("./models/postagens")
const postagem = mongoose.model("tb_posts")

require("./models/categorias")
const categoria = mongoose.model("tb_cats")

class TestClass {
    aMethod() {
        return "returnValue";
    }
}

const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars)

const template = insecureHandlebars.compile('{{aMethod}}')
const output = template(new TestClass);

console.log(output)

//configurações
//sessão

app.use(session({
    secret: "tcc_mgj",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
    //middleware
app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
        next()
    })
    //body_parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', ExpressHandlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set('view engine', 'handlebars')

//mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/tcc").then(() => {
    console.log("Conctado ao mongo")
}).catch((erro) => {
    console.log("houve um erro ao tentar conectar: " + erro)
})

//public
app.use(express.static(path.join(__dirname, "public")))

//rotas
app.use('/routes', routes)
app.use("/usuarios", usuarios)

app.get('/routes', (req, res) => {
    postagem.find().populate("categoria_").sort({ dt_cadastro_: "desc" }).then((tb_posts) => {
        res.render('p_principal', { postagem: tb_posts })

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar.")
        res.redirect("/404")
    })
})

//começo pagina de categorias
app.get('/routes/p_categorias', (req, res) => {
    categoria.find().then((tb_cats) => {
        res.render("../views/p_categs", { categoria: tb_cats })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro interno ao listar categorias! Tente novamente mais tarde.")
        res.redirect("/routes/p_categorias")
    })
})

//fim pagina de categorias


//começo pagina categoria selecionada
app.get('/routes/p_categorias/:slug', (req, res) => {
    categoria.findOne({ slug: req.params.slug_ }).then((tb_cats) => {

        if (tb_cats) {

            postagem.find({ categoria: tb_cats._id }).then((tb_posts) => {
                res.render("../views/p_categ_result", { postagem: tb_posts, categoria: tb_cats })

            }).catch((erro) => {
                req.flash("error_msg", "Houve um erro interno durante a filtragem de resultados!")
                res.redirect("/routes/p_categorias")
            })
        } else {
            req.flash("error_msg", "Houve um erro interno durante a filtragem de resultados. Ou esta categoria não tem postagens relacionadas")
            res.redirect("/routes/p_categorias")
        }

    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro interno durante a filtragem de resultados.")
        res.redirect("/routes/p_categorias")
    })
})

//fim pagina categoria selecionada

app.get("/404", (req, res) => {
    res.send('Erro 404!')
})



//outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando!")
})