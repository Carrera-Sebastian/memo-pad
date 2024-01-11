const database = require('../config/database');
const mysql2 = require('mysql2');

const readCateg = (req, res) => {
    const readQuery = `SELECT * FROM categories ORDER BY id;`;
    const query = mysql2.format(readQuery);

    database.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
}

const createCateg = (req, res) => {
    const {name} = req.body;
    const createQuery = `INSERT INTO categories (name) VALUE (?);`;
    const query = mysql2.format(createQuery, [name]);

    database.query(query, (err, result) =>{
        if (err) throw err;
        const iden = result.insertId;
        res.status(201).send({id:iden, message: 'Categoria creada con exito'});
    })
}

const deleteCateg = (req, res) => {
    const {id} = req.params;
    const deleteQuery = `DELETE FROM categories WHERE id=?;`;
    const query = mysql2.format(deleteQuery, [id]);

    database.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);

        if (result.affectedRows != 0) {
            res.json({message: 'categorie deleted'});
        }else {
            res.json({message: 'categorie not found'});
        }
    })
}

module.exports = {
    readCateg,
    createCateg,
    deleteCateg
}