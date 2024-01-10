const express = require('express');
const noteRoutes = require('../routes/note.routes');
const userRoutes = require('../routes/user.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({entended: true}));

//endpoints
app.use('/note', noteRoutes);
app.use('/user', userRoutes);

module.exports = app;