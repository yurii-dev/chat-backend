const router = require("express").Router();

router.use("/users", require("./user"));
router.use("/dialogs", require("./dialog"));
router.use("/messages", require("./message"));
router.use("/upload", require("./upload"));

module.exports = router;
