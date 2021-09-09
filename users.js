const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const mongoose = require('mongoose')
const passport = require("passport")

require("../models/usuarios")
const usuario = mongoose.model("tb_user")


router.get("/registro", (req, res) => {
    res.render("../views/p_registro")
})

router.post("/registro", (req, res) => {
    var erros = []

    if (!req.body.n_email || typeof req.body.n_email == undefined || req.body.n_email == null) {
        erros.push({ texto: "Email Inválido" })
    }

    if (!req.body.n_nome || typeof req.body.n_nome == undefined || req.body.n_nome == null) {
        erros.push({ texto: "Nome Inválido" })
    }

    if (!req.body.n_senha || typeof req.body.n_senha == undefined || req.body.n_senha == null) {
        erros.push({ texto: "Senha Inválida" })
    }

    if (req.body.n_senha.length < 6) {
        erros.push({ texto: "Senha muito curta" })
    }

    if (req.body.n_senha != req.body.n_senha2) {
        erros.push({ texto: "As senhas não coincidem! Tente novamente" })
    }

    if (erros.length > 0) {
        res.render("../views/p_registro", { erros: erros })

    } else {
        usuario.findOne({ email_: req.body.n_email }).then((tb_user) => {

            if (tb_user) {
                req.flash("error_msg", "Email já cadastrado! tente cnovamente com outro")
                res.redirect("/usuarios/registro")

            } else {
                const novo_user = new usuario({

                    nome_: req.body.n_nome,
                    email_: req.body.n_email,
                    senha_: req.body.n_senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novo_user.senha_, salt, (erro, hash) => {
                        if (erro) {
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuario")
                            res.redirect("/")
                        }
                        novo_user.senha_ = hash

                        novo_user.save().then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso!")
                            res.redirect("/usuarios/registro")
                        }).catch((erro) => {
                            req.flash("error_msg", "Houve um erro ao criar usuario! tente novamente")
                            res.redirect("/usuarios/registro")
                        })
                    })
                })
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno no sistema. Tente novamente mais tarde.")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("../views/p_login")
})

router.post("/login", (req, res, next) => {

    passport.authenticate("local", {
        successRedirect: "/routes",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Você desconectou de sua conta")
    res.redirect("/usuarios/login")
})

//exportar
module.exports = router