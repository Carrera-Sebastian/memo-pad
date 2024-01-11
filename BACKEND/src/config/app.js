const express = require('express');
const cors = require('cors');

const noteRoutes = require('../routes/note.routes');
const userRoutes = require('../routes/user.routes');
const archNoteRoutes = require('../routes/archivedNote.routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({entended: true}));
app.use(cors());

//endpoints
app.use('/note', noteRoutes);
app.use('/user', userRoutes);
app.use('/note/archived', archNoteRoutes);

module.exports = app;