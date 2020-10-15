const express = require('express');
const { render } = require('../app');
const router = express.Router();
const mysql = require('../mysql').pool;
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');



// Realiza login do aluno
router.post('/login', (req, res, next)=>{
    const login = {
        matricula: req.body.matricula,
        senha: req.body.senha
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
                if(resultado){
                    const token = jwt.sign({
                        cod: resultado[0].id
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "50s"
                    });
                    return res.status(200).send({
                        status_code: 200,
                        auth: true,
                        cod: resultado[0].id, 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    })

                }
            }
        )
    })
})

// Retorna os dados de um aluno
router.get('/consultaAluno/:id', login, (req, res, next)=>{
    mysql.getConnection((error, conn) => {
        if(error) {return res.status(500).send({ error: error}) }
        conn.query(
            "SELECT t.sala AS Sala, d.nome AS Disciplina, a.matricula AS Matricula, CONCAT(p.pnome, ' ', p.unome) AS Nome, t.primeira_nota AS 1_Nota, t.segunda_nota AS 2_Nota, t.faltas AS Faltas FROM turma AS t INNER JOIN disciplina AS d ON t.fk_turma_disciplina = d.id INNER JOIN aluno AS a ON t.fk_turma_aluno = a.id INNER JOIN pessoa AS p ON a.id = p.id INNER JOIN pessoa AS pr ON pr.id = p.id WHERE p.id = ?",
            [req.params.id],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error}) }
                return res.status(200).send({status_code: 200, lista: resultado})
            }
        )

    });    
});



module.exports = router;