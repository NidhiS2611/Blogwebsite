const express = require("express");
const router = express.Router();
const { sendMessage,getMessages,deleteForMe,deleteForEveryone } = require("../controller/conversationcontroller");
const authmiddleware = require("../middleware/authmiddle");

router.post("/send", authmiddleware, sendMessage);
router.get("/get/:id", authmiddleware, getMessages);
router.put("/conversation/delete-for-me/:id", deleteForMe);
router.put("/conversation/delete-for-everyone/:id", deleteForEveryone);

module.exports = router;