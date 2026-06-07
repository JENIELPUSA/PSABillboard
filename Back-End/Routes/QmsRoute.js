const express = require("express");
const router = express.Router(); //express router
const qmsController = require("../Controller/QmsController");
router.route("/").get(qmsController.DisplayQmsCorner)
    .post(qmsController.createQmsCorner);

router
    .route("/:id")
    .patch(qmsController.updateQmsCorner)
    .delete(qmsController.deleteQmsCorner)


module.exports = router;