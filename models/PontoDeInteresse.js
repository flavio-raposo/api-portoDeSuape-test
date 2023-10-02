const mongoose = require('mongoose');

//criar tabela empresa
const Ponto = mongoose.model('PontoDeInteresse', {

    id: Number,
    Nome: String,
    Atividade: String,
    Endereço: String,
    Contato: String,
    Latitude: String,
    Longitude: String,
})

module.exports = Ponto