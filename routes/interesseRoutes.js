const router = require('express').Router();

const PontoDeInteresse = require('../models/PontoDeInteresse');

//Create - criação dos dados
router.post('/', async (req, res) => {

    //req.body
    const {id, Nome, Atividade, Endereço, Contato, Latitude, Longitude } = req.body;

    if(!Nome){
        res.status(422).json({error: 'O nome é obrigatório'});
        return;
    }

    const ponto = {
        id,
        Nome,
        Atividade,
        Endereço,
        Contato,
        Latitude,
        Longitude
    };

    try{
        // checando pra ver se o ponto já existe no banco de dados
        const pontoExiste = await PontoDeInteresse.findOne({id: id});
        // se a Ponto não existir, insere os dados no banco de dados
        if(!pontoExiste) {
            //criando dados(passando o objeto)
            await PontoDeInteresse.create(ponto);
            //dado criado com sucesso
            res.status(201).json({message: 'Ponto inserida no sistema com sucesso!'});
        }
    }
    catch(error){
        res.status(500).json({error: error});
    }

})

//Read - leitura de dados
router.get('/', async (req, res) => {

    try {
        
        const ponto = await PontoDeInteresse.find();

        res.status(200).json(ponto);
    } 
    catch (error) {
        res.status(5000).json({error: error});
    }
})

// GET by ID
router.get('/:id', async (req, res) => {
    
    //extrair o dado da requisição, pelo req.params
    const id = req.params.id;

    try {
        
        const ponto = await PontoDeInteresse.findOne({id: id});

        if(!ponto){
            res.status(422).json({message: 'O ponto não foi encontrada!'});
            return;
        };

        res.status(200).json(ponto);

    } catch (error) {
        res.status(500).json({error: error});
    }
})

//Update - atualização de dados(PUT , PATCH)
router.patch('/:id', async (req, res) =>{

    const id = req.params.id;

    const { Nome, Atividade, Endereço, Contato, Latitude, Longitude } = req.body;

    const ponto = {
        id,
        Nome,
        Atividade,
        Endereço,
        Contato,
        Latitude,
        Longitude
    };

    try {
        
        const updatePonto = await PontoDeInteresse.updateOne({id: id}, ponto);

        //verificar se o usuário existe
        if(updatePonto.matchedCount === 0){
            res.status(422).json({ message: 'Ponto não encontrada'});
            return;
        };

        res.status(200).json(ponto);
    } 
    catch (error) {
        res.status(500).json({error: error});        
    }
})

router.delete('/:id', async (req, res) =>{

    const id = req.params.id;

    const ponto = await PontoDeInteresse.findOne({id: id});

    if(!ponto){
        res.status(422).json({message: 'A ponto não foi encontrada!'});
        return;
    };

    try {
        await PontoDeInteresse.deleteOne({id: id});
        
        res.status(200).json({message: 'Ponto deletada com sucesso!'});
    } 
    catch (error) {
        res.status(500).json({error: error});
    }
})

// GET by LIKE
router.get('/query/:param', async (req, res) => {

        const param = req.params.param;

        const pesquisa = new RegExp(`${param}`, 'gi');

    try {
        // pesquisando via regex para encontrar o resultado
        const ponto = await PontoDeInteresse.findOne(
            {
                "$or": [
                    {Nome: pesquisa},
                    {Atividade: pesquisa},
                    {Endereço: pesquisa},
                    {Contato: pesquisa},
                    {Latitude: pesquisa},
                    {Longitude: pesquisa}
                ]
            }
        );

        if(!ponto){
            res.status(422).json({message: 'A ponto não foi encontrada!'})
            return;
        }

        res.status(200).json(ponto);

    } catch (error) {
        res.status(500).json({error: error});
    }
})

//exportar para puxar no index
module.exports = router;