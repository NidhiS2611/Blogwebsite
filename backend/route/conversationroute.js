const express = require("express");
const router = express.Router();
const { sendMessage,getMessages } = require("../controller/conversationcontroller");
const authmiddleware = require("../middleware/authmiddle");

router.post("/send", authmiddleware, sendMessage);
router.get("/get/:id", authmiddleware, getMessages);

module.exports = router;