const express = require("express"),
  { my_dialogs } = require("./myDialogs"),
  { create_dialog } = require("./createDialog");

const router = express.Router();

// get my dialogs
router.get("/", my_dialogs);

// create a dialog
router.post("/", create_dialog);

module.exports = router;
