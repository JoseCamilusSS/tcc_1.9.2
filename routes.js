const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const { eAdmin } = require("../helpers/eAdmin")

require("../models/postagens")
const postagem = mongoose.model("tb_posts")

require("../models/categorias")
const categoria = mongoose.model("tb_cats")

require("../models/usuarios")
const usuario = mongoose.model("tb_user")

const usucat = usuario && categoria
    //rotas

//começo pagina inicial do site
router.get('/p_inicial', (req, res) => {
    res.render("../views/p_inicial")
})

//fim pagina inicial do site

//começo pagina principal do site
router.get('/p_principal', (req, res) => {
    categoria.find().then((tb_cats) => {
        res.render("../views/p_principal", { categoria: tb_cats })
    })
})

//fim pagina principal do site

//começo duvidas
router.get('/p_duvidas', (req, res) => {
    res.render("../views/p_duvidas")
})

//fim duvidas

//começo de meus posts
router.get('/meus_form', (req, res) => {
    postagem.find().populate("categoria_").sort({ dt_cadastro_: "desc" }).then((tb_posts) => {
        res.render("../views/meus_form", { postagem: tb_posts })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao apresentar a postagem!")
        res.redirect("/routes/meus_form")
    })
})

//fim de meus posts

//criar post
router.get('/cad_post', (req, res) => {

    usucat.find().then((tb_cats, tb_user) => {
        res.render("../views/cad_post", { categoria: tb_cats, usuario: tb_user })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao tentar realizar a postagem, tente novamente!")
        res.redirect("/routes/cad_post")
    })
})

router.post('/cad_post/cadastrado', (req, res) => {

    var erros = []

    if (req.body.n_quant_vagas <= 0) {
        erros.push({ texto: "Quantidade inválida! tente novamente" })

    }
    if (req.body.n_categoria == "0") {
        erros.push({ texto: "Quantidade inválida! selecione uma categoria." })
    }
    if (erros.length > 0) {
        res.render("../views/cad_post", { erros: erros })
    } else {
        const novo_post = {
            titulo_: req.body.n_titulo,
            categoria_: req.body.n_categoria,
            vagas_: req.body.n_quant_vagas,
            salario_: req.body.n_salario,
            descricao_: req.body.n_descricao,
            link_: req.body.n_link_formulario,
            id_user_: req.body.n_usu
        }
        new postagem(novo_post).save().then(() => {
                req.flash("success_msg", "Postagem realizada com sucesso!")
                res.redirect("/routes/meus_form")
            })
            .catch((erro) => {
                req.flash("error_msg", "Houve um erro ao tentar realizar a postagem, tente novamente!")
                res.redirect("/routes/meus_form")
            })
    }
})

//fim criar post

//começo editar post
router.get("/edit/:id", (req, res) => {

    postagem.findOne({ _id: req.params.id }).then((tb_posts) => {

        categoria.find().then((tb_cats) => {
            res.render("../views/edit_post", { categoria: tb_cats, postagem: tb_posts, })

        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao tentar listar categorias! tente novamente.")
            res.redirect("/routes/meus_form")
        })

    }).catch((erro) => {
        req.flash("error_msg", "Essa postagem não existe! tente novamente.")
        res.redirect("/routes/meus_form")
    })
})

//começo salvar edição de post
router.post("/edit/save", (req, res) => {

    postagem.findOne({ _id: req.body.id }).then((postagem) => {

        postagem.titulo_ = req.body.n_titulo
        postagem.categoria_ = req.body.n_categoria
        postagem.vagas_ = req.body.n_quant_vagas
        postagem.salario_ = req.body.n_salario
        postagem.descricao_ = req.body.n_descricao
        postagem.link_ = req.body.n_link_formulario

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem salva com sucesso!")
            res.redirect("/routes/meus_form")
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno ao tentar salvar a edição da postagem! Tente novamente.")
            res.redirect("/routes/meus_form")
        })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao tentar editar a postagem! Tente novamente.")
        res.redirect("/routes/meus_form")
    })
})

//fim salvar edição de post
//fim editar post

//começo excluir post
router.post("/meus_form/dell", (req, res) => {
    postagem.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Postagem excluida com sucesso!")
        res.redirect("/routes/meus_form")
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao tentar deletar postagem! Tente novamente")
        res.redirect("/routes/meus_form")
    })
})

//fim excluir post

//começo de categorias
router.get('/categ', eAdmin, (req, res) => {
    categoria.find().sort({ nome_: 'asc' }).then((tb_cats) => {
        res.render("../views/minhas_categ", { categoria: tb_cats })
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao apresentar a postagem!")
        res.redirect("/routes/categ")
    })
})

//fim de categorias

//criar categoria
router.get('/cad_categ', eAdmin, (req, res) => {
    res.render("../views/cad_categorias")
})

router.post('/cad_categ/cadastrado', eAdmin, (req, res) => {

    var erros = []

    if (!req.body.nome_cat || typeof req.body.nome_cat == undefined || req.body.nome_cat == null) {
        erros.push({ texto: "Quantidade inválida" })
    }
    if (!req.body.slug_cat || typeof req.body.slug_cat == undefined || req.body.slug_cat == null) {
        erros.push({ texto: "Quantidade inválida" })
    }
    if (erros.length > 0) {
        res.render("../views/cad_categorias", { erros: erros })
    } else {
        const nova_cat = {
            nome_: req.body.nome_cat,
            slug_: req.body.slug_cat
        }
        new categoria(nova_cat).save().then(() => {
                req.flash("success_msg", "Cadastro realizado!")
                res.redirect("/routes/categ")
            })
            .catch((erro) => {
                req.flash("error_msg", "Houve um erro ao tentar cadastrar!")
                res.redirect("/routes/cad_categorias")
            })
    }
})

//fim criar categoria

//começo excluir categoria
router.post("/categ/dell", eAdmin, (req, res) => {
    categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "categoria excluida com sucesso!")
        res.redirect("/routes/categ")
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro ao tentar deletar categoria! Tente novamente")
        res.redirect("/routes/categ")
    })
})

//fim excluir categoria

//exportar
module.exports = router