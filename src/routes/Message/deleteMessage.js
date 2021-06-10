const asyncHandler = require("express-async-handler"),
  Dialog = require("../../models/Dialog"),
  Message = require("../../models/Message");

exports.delete_message = asyncHandler(async (req, res) => {
  const { messageId = null } = req.body;
  if (!messageId) {
    return res.status(400).json({ message: "Invalid data" });
  }
  let message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ message: "Message not found" });
  }

  if (String(message.user) !== String(req.user.id)) {
    return res.status(403).json({ message: "Not have permision" });
  }
  const dialogId = message.dialog;
  await message.remove();
  let lastMessage = await Message.findOne({ dialog: dialogId }, {}, { sort: { createdAt: -1 } });
  const dialog = await Dialog.findById(dialogId);
  if (!dialog) {
    return res.status(404).json({ message: "Dialog not found" });
  }
  dialog.lastMessage = lastMessage ? lastMessage._id : null;
  await dialog.save();
  res.sendStatus(200);
});
