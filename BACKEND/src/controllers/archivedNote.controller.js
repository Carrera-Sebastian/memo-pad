const database = require('../config/database');
const mysql2 = require('mysql2');

const toggleArchiveNote = (req, res) => {
    const { id } = req.params;
    const { archived } = req.body; // true o false

    const updateQuery = `UPDATE note SET archived = ? WHERE id = ?;`;
    const query = mysql2.format(updateQuery, [archived, id]);

    database.query(query, (err) => {
        if (err) throw err;
        res.json({ message: 'Nota actualizada', id: id });
    });
};

module.exports = {toggleArchiveNote};