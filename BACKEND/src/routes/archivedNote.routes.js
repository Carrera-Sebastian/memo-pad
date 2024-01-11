const {Router} = require('express');

const {toggleArchiveNote} = require('../controllers/archivedNote.controller');
const router = Router();

router.put('/:id', toggleArchiveNote);

module.exports = router;