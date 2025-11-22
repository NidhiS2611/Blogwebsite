const express = require('express');
const router = express.Router();

const authmiddle = require('../middleware/authmiddle');
const { comment,editcomment,deletecomment } = require('../controller/commentontroller');

router.post('/comment/:id', authmiddle, comment);
router.put('/edit/:id',authmiddle,editcomment)
router.delete('/delete/:id',authmiddle,deletecomment)

module.exports = router;