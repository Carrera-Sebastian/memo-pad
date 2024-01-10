// --db--
connection.connect((err) => {
    if (err) throw err;
    console.log('BD conectada');
});

// const querySQL = 'SHOW tables;';
// connection.query(querySQL, (err, res) => {
//     if (err) throw err;
//     console.log('respuesta sql', res);
// })

const insertQuery = `insert into note (body, tag) VALUES ('Nota desde #app.js', '#app.js');`;
connection.query(insertQuery, (err, res) => {
    if (err) throw err;
    console.log('respuesta insert', res);
})
const getQuery = `select * from note;`;

connection.query(getQuery, (err, res) => {
    if (err) throw err;
    console.log('respuesta get', res);
})

app.listen(3000, ()=>{
    console.log('Servidor encendido');
});