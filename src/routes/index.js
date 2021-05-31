const router = require("express").Router();

router.use("/users", require("./User"));
router.use("/dialogs", require("./Dialog"));
router.use("/messages", require("./Message"));
router.use("/upload", require("./Upload"));

module.exports = router;
