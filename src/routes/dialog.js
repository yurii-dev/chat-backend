const express = require("express"),
  asyncHandler = require("express-async-handler"),
  User = require("../models/User"),
  Dialog = require("../models/Dialog"),
  Message = require("../models/Message");

const router = express.Router();

// get my dialogs
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const dialogs = await Dialog.find()
      .or([{ author: userId }, { partner: userId }])
      .populate({
        path: "author",
        select: ["email", "username", "avatar"],
      })
      .populate({
        path: "partner",
        select: ["email", "username", "avatar"],
      })
      .populate({
        path: "lastMessage",
        select: ["text", "createdAt", "read", "user"],
      });
    res.status(200).json({ dialogs });
  })
);

// create a dialog
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { partnerId, text } = req.body.dialog;
    if (!partnerId || !text.trim()) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.sendStatus(404);
    }
    const isExistOne = await Dialog.findOne({
      author: req.user.id,
      partner: partner._id,
    });

    const isExistTwo = await Dialog.findOne({
      author: partner._id,
      partner: req.user.id,
    });

    if (isExistOne || isExistTwo) {
      return res.status(400).json({ error: "Dialog is exist" });
    }

    const dialog = new Dialog({
      author: req.user.id,
      partner: partner._id,
    });

    await dialog.save();

    const message = new Message({
      text,
      dialog: dialog._id,
      user: req.user.id,
    });

    await message.save();
    dialog.lastMessage = message._id;
    await dialog.save();
    res.status(201).send();
  })
);

// //delete dialog ????
// router.delete(
//   "/",
//   asyncHandler(async (req, res) => {
//     const dialog = await Dialog.findById(req.body.dialogId);
//     if (dialog) {
//       await dialog.remove();
//       res.sendStatus(200);
//     } else {
//       res.sendStatus(404);
//     }
//   })
// );

module.exports = router;
