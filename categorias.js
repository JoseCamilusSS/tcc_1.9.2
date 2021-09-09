const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const tcc = new Schema({
    nome_: {
        type: String,
        require: true
    },
    slug_: {
        type: String,
        require: true
    }
})
mongoose.model('tb_cats', tcc)