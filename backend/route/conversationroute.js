const express = require("express");
const router = express.Router();
const { sendMessage } = require("../controller/conversationcontroller");
const authmiddleware = require("../middleware/authmiddleware");

router.post("/send", authmiddleware, sendMessage);

module.exports = router;