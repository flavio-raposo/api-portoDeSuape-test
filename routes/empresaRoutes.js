const router = require('express').Router();

const Empresa = require('../models/Empresa');

//Create - criação dos dados
router.post('/', async (req, res) => {

    //req.body
    const {id, Nome, Atividade, Município, Polo, Endereço, Contato, Latitude, Longitude } = req.body;

    if(!Nome){
        res.status(422).json({error: 'O nome é obrigatório'});
        return;
    }

    const empresa = {
        id,
        Nome,
        Atividade,
        Município,
        Polo,
        Endereço,
        Contato,
        Latitude,
        Longitude
    };

    try{
        // checando pra ver se a empresa já existe no banco de dados
        const empresaExiste = await Empresa.findOne({id: id});
        // se a empresa não existir, insere os dados no banco de dados
        if(!empresaExiste) {
            //criando dados(passando o objeto)
            await Empresa.create(empresa);
            //dado criado com sucesso
            res.status(201).json({message: 'Empresa inserida no sistema com sucesso!'});
        }
    }
    catch(error){
        res.status(500).json({error: error});
    }

})

//Read - leitura de dados
router.get('/', async (req, res) => {

    try {
        
        const empresa = await Empresa.find();

        res.status(200).json(empresa);
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
        
        const empresa = await Empresa.findOne({id: id});

        if(!empresa){
            res.status(422).json({message: 'A empresa não foi encontrada!'});
            return;
        };

        res.status(200).json(empresa);

    } catch (error) {
        res.status(500).json({error: error});
    }
})

//Update - atualização de dados(PUT , PATCH)
router.patch('/:id', async (req, res) =>{

    const id = req.params.id;

    const { Nome, Atividade, Município, Polo, Endereço, Contato, Latitude, Longitude } = req.body;

    const empresa = {
        id,
        Nome,
        Atividade,
        Município,
        Polo,
        Endereço,
        Contato,
        Latitude,
        Longitude
    };

    try {
        
        const updateEmpresa = await Empresa.updateOne({id: id}, empresa);

        //verificar se o usuário existe
        if(updateEmpresa.matchedCount === 0){
            res.status(422).json({ message: 'Empresa não encontrada'});
            return;
        };

        res.status(200).json(empresa);
    } 
    catch (error) {
        res.status(500).json({error: error});        
    }
})

router.delete('/:id', async (req, res) =>{

    const id = req.params.id;

    const empresa = await Empresa.findOne({id: id});

    if(!empresa){
        res.status(422).json({message: 'A empresa não foi encontrada!'});
        return;
    };

    try {
        await Empresa.deleteOne({id: id});
        
        res.status(200).json({message: 'Empresa deletada com sucesso!'});
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
        const empresa = await Empresa.findOne(
            {
                "$or": [
                    {Nome: pesquisa}
                ]
            }
        );

        if(!empresa){
            res.status(422).json({message: 'A empresa não foi encontrada!'})
            return;
        }

        res.status(200).json(empresa);

    } catch (error) {
        res.status(500).json({error: error});
    }
})

//exportar para puxar no index
module.exports = router;