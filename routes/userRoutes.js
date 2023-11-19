const router = require('express').Router();

const User = require('../models/User');

//Create - criação dos dados
router.post('/', async (req, res) => {

    //req.body
    const {id, Name, Username, Email, Password, Role, Journey} = req.body;

    if(!Name){
        res.status(422).json({error: 'O nome é obrigatório'});
        return;
    }

    const user = {
        id,
        Name, 
        Username, 
        Email, 
        Password, 
        Role,
        Journey
    };

    try{
        // checando pra ver se a user já existe no banco de dados
        const userExiste = await User.findOne({id: id});
        // se a user não existir, insere os dados no banco de dados
        if(!userExiste) {
            //criando dados(passando o objeto)
            await User.create(user);
            //dado criado com sucesso
            res.status(201).json({message: 'Usuário inserido no sistema com sucesso!'});
        }
    }
    catch(error){
        res.status(500).json({error: error});
    }

})

//Read - leitura de dados
router.get('/', async (req, res) => {

    try {

        const user = await User.find();

        res.status(200).json(user);
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

        const user = await User.findOne({id: id});

        if(!user){
            res.status(422).json({message: 'Usuário não foi encontrado!'});
            return;
        };

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: error});
    }
})

//Update - atualização de dados(PUT , PATCH)
router.patch('/:id', async (req, res) =>{

    const id = req.params.id;

    const {Name, Username, Email, Password, Role, Journey } = req.body;

    const user = {
        id,
        Name, 
        Username, 
        Email, 
        Password, 
        Role,
        Journey
    };

    try {

        const updateUser = await User.updateOne({id: id}, user);

        //verificar se o usuário existe
        if(updateUser.matchedCount === 0){
            res.status(422).json({ message: 'Usuário não foi encontrado!'});
            return;
        };

        res.status(200).json(user);
    } 
    catch (error) {
        res.status(500).json({error: error});        
    }
})

router.delete('/:id', async (req, res) =>{

    const id = req.params.id;

    const user = await User.findOne({id: id});

    if(!user){
        res.status(422).json({message: 'Usuário não foi encontrado!'});
        return;
    };

    try {
        await User.deleteOne({id: id});

        res.status(200).json({message: 'Usuário deletado com sucesso!'});
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
        const user = await User.findOne(
            {
                "$or": [
                    {Name: pesquisa},
                    {Username: pesquisa},
                    {Email: pesquisa},
                    {Password: pesquisa},
                    {Role: pesquisa},
                    {Journey: pesquisa}
                ]
            }
        );

        if(!user){
            res.status(422).json({message: 'Usuário não encontrado!'})
            return;
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({error: error});
    }
})

//exportar para puxar no index
module.exports = router;