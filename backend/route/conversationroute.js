const express = require("express");
const router = express.Router();
const { sendMessage,getMessages,deleteForMe,deleteForEveryone } = require("../controller/conversationcontroller");
const authmiddleware = require("../middleware/authmiddle");

router.post("/send", authmiddleware, sendMessage);
router.get("/get/:id", authmiddleware, getMessages);
router.put("/delete-for-me/:id",authmiddleware, deleteForMe);
router.put("/delete-for-everyone/:id", authmiddleware, deleteForEveryone);

module.exports = router;