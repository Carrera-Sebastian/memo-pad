const {Router} = require('express');

const {readCateg, createCateg, deleteCateg} = require('../controllers/categorie.controller');

const router = Router();

router.get('/', readCateg);

router.post('/', createCateg);

router.delete('/:id', deleteCateg);

module.exports = router;