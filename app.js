const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaAlunos = require('./routes/alunos');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false})); //apenas dados simples
app.use(bodyParser.json()); // Json de entrada no body

app.use((req, res , next) =>{
    res.header('Acces-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requrested-With, Content-Type, Accept, Authorization'
        );

        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'GET');
            return res.status(200).send({});
        }

        next();
}) 

app.use('/alunos', rotaAlunos);

//Quando não encontra nenhuma rota
app.use((req, res, next) => {
    const erro = new Error('Não encontrado');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;