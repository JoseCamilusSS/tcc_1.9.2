module.exports = {
    eAdmin: function(req, res, next) {
        if (req.isAuthenticated() && req.user.eAdmin == 1) {
            return next()
        }
        req.flash("error_msg", "Opa opa! Você não tem permissão para acessar está página mocinho.")
        res.redirect("/routes")
    }
}