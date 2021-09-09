const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const tcc = new Schema({
    titulo_: {
        type: String,
        require: true
    },
    categoria_: {
        type: Schema.Types.ObjectId,
        ref: "tb_cats",
        require: true

    },
    id_user_: {
        type: Schema.Types.ObjectId,
        ref: "tb_user",
        require: true
    },
    vagas_: {
        type: Number,
        require: true
    },
    salario_: {
        type: String,
        require: true
    },
    descricao_: {
        type: String,
        require: true
    },
    link_: {
        type: String,
        require: true
    },
    dt_cadastro_: {
        type: Date,
        default: Date.now()
    }
})
mongoose.model('tb_posts', tcc)