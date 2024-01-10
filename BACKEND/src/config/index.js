const app = require('./app.js');
const database = require('./database');

const main = () => {
    database.connect((err) => {
        if (err) throw err
        console.log('Base de datos conectada');
    });
    app.listen(3000, () => {
        console.log('Servidor escuchando puerto 3000');
    });
};

main();