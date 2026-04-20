const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controller/conversationcontroller");
const authmiddleware = require("../middleware/authmiddle");

router.post("/send", authmiddleware, sendMessage);

module.exports = router;