const database = require('../config/database');
const mysql2 = require('mysql2');

//CRUD
const readNote = (req, res) => {
    const {archived} = req.query;
    const readQuery = `SELECT * FROM note WHERE archived = ${archived};`;

    const query = mysql2.format(readQuery);

    database.query(readQuery, (err, result) =>{
        if (err) throw err;
            res.json(result);
    });
};

const createNote = (req, res) => {
    const {body, tag} = req.body;
    const createQuery = `INSERT INTO note (body, tag, archived) VALUE(?,?,0);`;

    const query = mysql2.format(createQuery, [body, tag]);

    database.query(query, (err, result) =>{
        if (err) throw err;
        const iden = result.insertId;
        res.status(201).send({id:iden, message: 'Nota creada con exito'});
    })
};
const updateNote = (req, res) => {
    const {id} = req.params;
    const {body, tag} = req.body;
    
    const updateQuery = `UPDATE note SET body=?, tag=? WHERE id=?;`;
    const query = mysql2.format(updateQuery, [body, tag, id]);

    database.query(query, (err, result) => {
        if (err) throw err;
        if (result.affectedRows != 0){
            res.json({message: 'note updated'});
        }else{
            res.json({message: 'note not found'});
        };
    });
};
const deleteNote = (req, res) => {
    const {id} = req.params;
    const deleteQuery = `DELETE FROM note WHERE id=?;`;
    const query = mysql2.format(deleteQuery, [id]);

    database.query(query, (err, result) => {
        if (err) throw err;
        //console.log(result);
        if (result.affectedRows != 0){
            res.json({message: 'note deleted'});
        }else{
            res.json({message: 'note not found'});
        };
    });
};

module.exports = {
    createNote, 
    readNote,
    updateNote,
    deleteNote, 
}