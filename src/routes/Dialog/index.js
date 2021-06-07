const express = require("express"),
  { my_dialogs } = require("./myDialogs");

const router = express.Router();

// get my dialogs
router.get("/", my_dialogs);

module.exports = router;
