const express = require('express');
const router = express.Router();

const authmiddle = require('../middleware/authmiddle');
const { comment,editcomment,deletecomment, fetchcomment } = require('../controller/commentontroller');

router.post('/comment/:id', authmiddle, comment);
router.put('/edit/:id',authmiddle,editcomment)
router.delete('/delete/:id',authmiddle,deletecomment)
router.get('/fetch/:id',authmiddle,fetchcomment)

module.exports = router;