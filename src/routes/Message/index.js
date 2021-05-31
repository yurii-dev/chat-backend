const express = require("express"),
  { my_messages } = require("./myMessages"),
  { create_message } = require("./createMessage"),
  { delete_message } = require("./deleteMessage");

const router = express.Router();

// get all messages for a dialog by dialogId {  dialogId:""}
router.get("/", my_messages);

// create a message { message:{text:"", dialogId:""}}
router.post("/", create_message);

// delete a message
router.delete("/", delete_message);

module.exports = router;
