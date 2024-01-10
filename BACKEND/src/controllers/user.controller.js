const database = require('../config/database');
const mysql2 = require('mysql2');

const readUser = (req, res) => {
    const {id} = req.params;
    const readQuery = `SELECT * FROM user WHERE id=?;`;

    const query = mysql2.format(readQuery, [id]);

    database.query(query, (err, result) =>{
        if (err) throw err;
        if (result[0] !== undefined){
            res.json(result[0]);
        }else{
            res.json({message: 'User not found'});
        }
    });
};

const createUser = (req, res) => {
    const {name, password} = req.body;

    const createQuery = `INSERT INTO user (name, password) VALUE(?,?);`;

    const query = mysql2.format(createQuery, [name, password]);

    database.query(query, (err, result) =>{
        if (err) throw err;
        console.log(result);
        res.send({message: 'user created'});
    })

};
const updateUser = (req, res) => {
    const {id} = req.params;
    const {name, password} = req.body;
    
    const updateQuery = `UPDATE user SET name=?, password=? WHERE id=?;`;
    const query = mysql2.format(updateQuery, [name, password, id]);

    database.query(query, (err, result) => {
        if (err) throw err;
        if (result.affectedRows != 0){
            res.json({message: 'user updated'});
        }else{
            res.json({message: 'User not found'});
        };
    });
};
const deleteUser = (req, res) => {
    const {id} = req.params;
    const deleteQuery = `DELETE FROM user WHERE id=?;`;
    const query = mysql2.format(deleteQuery, [id]);

    database.query(query, (err, result) => {
        if (err) throw err;
        //console.log(result);
        if (result.affectedRows != 0){
            res.json({message: 'user deleted'});
        }else{
            res.json({message: 'User not found'});
        };
    });
};

module.exports = {
    createUser, 
    readUser,
    updateUser,
    deleteUser
}