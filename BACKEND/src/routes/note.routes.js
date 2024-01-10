const {Router} = require('express');

const {createNote, readNote, updateNote, deleteNote} = require('../controllers/note.controller')

const router = Router();

router.get('/', readNote);

router.post('/', createNote);

router.put('/:id', updateNote);

router.delete('/:id', deleteNote);

module.exports = router;