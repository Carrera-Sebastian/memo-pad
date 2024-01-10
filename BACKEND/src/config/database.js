const mysql2 = require('mysql2');

const database = mysql2.createConnection({
    host: '127.0.0.1',
    port: 33306,
    user: 'root',
    password: '123',
    database: 'bd_app_notes'
});

module.exports = database;