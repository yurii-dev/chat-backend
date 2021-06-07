const { updateReadStatus } = require("../../resourses/updateReadStatus"),
  asyncHandler = require("express-async-handler"),
  Dialog = require("../../models/Dialog"),
  Message = require("../../models/Message"),
  { decryptText } = require("../../resourses/messageEncrypting");

exports.my_messages = asyncHandler(async (req, res, next) => {
  const dialogId = req.query.dialogId;
  if (!dialogId) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const dialog = await Dialog.findById(dialogId);
  if (!dialog) {
    return res.status(400).json({ message: "Invalid data" });
  }
  await updateReadStatus(dialogId, req.user.id, next);
  let messages = await Message.find({
    dialog: dialogId,
  })
    .populate("attachments")
    .populate({
      path: "user",
      select: ["avatar"],
    });

  messages.map((message) => {
    message.text = decryptText(message.text, dialogId);
  });
  res.status(200).json({ messages });
});
