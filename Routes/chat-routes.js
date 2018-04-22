const express = require('express');
const router = express.Router();
const chatControllers = require("../Controllers/chatController");
function body_logger_middleware(req, res, next) {
    console.log("req body \n", JSON.stringify(req.body));
    next();
}
router.post("/create_chat", chatControllers.create_chat_group);
router.post("/chat_list", chatControllers.chat_list_of_user);
router.post("/send_message", chatControllers.send_message);
router.post("/message_list", chatControllers.get_message_list);
router.get("/message_list/:chat_id", chatControllers.get_message_list);

module.exports = router;