const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//models
require("../models/usuarios")
const usuario = mongoose.model("tb_user")

module.exports = function(passport) {

    passport.use(new localStrategy({ usernameField: 'n_email', passwordField: 'n_senha' }, (email_, senha_, done) => {

        usuario.findOne({ email_: email_ }).then((tb_user) => {
            if (!tb_user) {
                return done(null, false, { message: "Esta conta não existe!" })
            }
            bcrypt.compare(senha_, tb_user.senha_, (erro, batem) => {

                if (batem) {
                    return done(null, tb_user)
                } else {
                    return done(null, false, { message: "Senha ou email incorreto! tente novamente" })
                }
            })
        })
    }))

    passport.serializeUser((tb_user, done) => {

        done(null, tb_user.id)
    })

    passport.deserializeUser((id, done) => {
        usuario.findById(id, (err, tb_user) => {
            done(err, tb_user)
        })
    })
}