const {Router} = require('express');

const {createNote, readNote, updateNote, deleteNote} = require('../controllers/note.controller')

const router = Router();

router.get('/:id', readNote);

router.post('/', createNote);

router.put('/', updateNote);

router.delete('/', deleteNote);

module.exports = router;