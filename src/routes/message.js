const express = require("express"),
  asyncHandler = require("express-async-handler"),
  User = require("../models/User"),
  Dialog = require("../models/Dialog"),
  Message = require("../models/Message");

const router = express.Router();

const updateReadStatus = async (dialogId, userId, next) => {
  try {
    await Message.updateMany(
      {
        dialog: dialogId,
        user: { $ne: userId },
      },
      {
        $set: { read: true },
      }
    );
  } catch (error) {
    next(error);
  }
};

// get all messages for a dialog by dialogId {  dialogId:""}
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const dialogId = req.body.dialogId;
    if (!dialogId) {
      return res.status(400).json({ message: "Invalid data" });
    }
    const dialog = await Dialog.findById(dialogId);
    if (!dialog) {
      return res.status(400).json({ message: "Invalid data" });
    }
    await updateReadStatus(dialogId, req.user.id, next);
    const messages = await Message.find({
      dialog: req.body.dialogId,
    }).populate("attachments");
    res.status(200).json({ messages });
  })
);

// create a message { message:{text:"", dialogId:""}}
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { text, dialogId, attachments } = req.body.message;
    if (!dialogId) {
      return res.status(400).json({ message: "Invalid data" });
    }
    if (!attachments && !text.trim()) {
      return res.status(400).json({ message: "Invalid data" });
    }
    let dialog = await Dialog.findById(dialogId);
    if (!dialog) {
      return res.status(404).json({ error: { message: "Dialog not found" } });
    }

    const message = new Message({
      text: text ? text : "",
      dialog: dialogId,
      user: req.user.id,
      attachments: attachments ? attachments : null,
    });
    await message.save();
    dialog.lastMessage = message._id;
    await dialog.save();

    res.status(201).json(message);
  })
);

// delete a message
router.delete(
  "/",
  asyncHandler(async (req, res) => {
    let message = await Message.findById(req.body.messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (String(message.user) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not have permision" });
    }
    const dialogId = message.dialog;
    await message.remove();
    let lastMessage = await Message.findOne(
      { dialog: dialogId },
      {},
      { sort: { createdAt: -1 } }
    );
    const dialog = await Dialog.findById(dialogId);
    if (!dialog) {
      return res.status(404).json({ message: "Dialog not found" });
    }
    dialog.lastMessage = lastMessage ? lastMessage._id : null;
    await dialog.save();
    res.sendStatus(200);
  })
);

module.exports = router;
