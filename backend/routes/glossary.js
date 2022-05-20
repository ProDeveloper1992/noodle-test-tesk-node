const express = require('express');
const router = express.Router();
const { addGlossary, deleteGlossary, getAllGlossary, editGlossary } = require('../controller/glossary')

router.post('/add', addGlossary)
router.put('/edit/:glossId', editGlossary)
router.get('/getAllGlossary', getAllGlossary)
router.delete('/delete/:glossId', deleteGlossary)

module.exports = router;
