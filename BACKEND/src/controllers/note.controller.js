const database = require('../config/database');
const mysql2 = require('mysql2');

//CRUD
const readNote = (req, res) => {
    const {id} = req.params;
    console.log('Desde el controlador.');
    res.send(`${id}`);
}

const createNote = (req, res) => {
    const {body, tag} = req.body;
    res.send(`${body}: ${tag}`);
};
const updateNote = (req, res) => {res.send('Peticion PUT');};
const deleteNote = (req, res) => {res.send('Peticion DELETE');};

module.exports = {
    createNote, 
    readNote,
    updateNote,
    deleteNote
}