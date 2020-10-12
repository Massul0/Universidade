const express = require('express');
const { render } = require('../app');
const router = express.Router();
const mysql = require('../mysql').pool;



// Realiza login do aluno
router.post('/login', (req, res, next)=>{
    const login = {
        matricula: req.body.matricula,
        senha: req.body.preco
    };

    mysql.getConnection((error, conn)=>{
        if(error) {return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT id FROM aluno WHERE aluno.matricula = ? AND aluno.senha = ?;',
            [req.body.matricula, req.body.senha],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error}) }
                if (resultado.length < 1){
                    return res.status(401).send({
                        status_code: 401,
                        auth: false, 
                        mensagem: 'Falha na autenticação'
                    })
                }
                return res.status(200).send({
                    status_code: 200,
                    auth: true, 
                    mensagem: 'Autenticado com sucesso'
                })
            }
        )
    })
})

// Retorna os dados de um aluno
router.get('/:cpf', (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({ error: error}) }
        conn.query(
            'SELECT * FROM pessoa WHERE cpf = ?;',
            [req.params.cpf],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error}) }
                return res.status(200).send({response: resultado})
            }
        )

    });    
});



module.exports = router;