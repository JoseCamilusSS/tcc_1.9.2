const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tcc = new Schema({
    nome_: {
        type: String,
        required: true
    },
    email_: {
        type: String,
        required: true
    },
    senha_: {
        type: String,
        required: true
    },
    eAdmin_: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("tb_user", tcc)