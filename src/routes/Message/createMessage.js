const asyncHandler = require("express-async-handler"),
  Dialog = require("../../models/Dialog"),
  Message = require("../../models/Message"),
  UploadFile = require("../../models/UploadFile"),
  { encryptText } = require("../../resourses/messageEncrypting");

exports.create_message = asyncHandler(async (req, res) => {
  const { text = null, dialogId = null, attachments = null } = req.body.message;
  if (!dialogId) {
    return res.status(400).json({ message: "Invalid data" });
  }
  if (!attachments && !text) {
    return res.status(400).json({ message: "Invalid data" });
  }
  let dialog = await Dialog.findById(dialogId);
  if (!dialog) {
    return res.status(404).json({ error: { message: "Dialog not found" } });
  }
  if (attachments) {
    let attachedFile = await UploadFile.findById(attachments);
    if (!attachedFile) {
      return res.status(400).json({ message: "Invalid data" });
    }
  }
  const message = new Message({
    text: text ? encryptText(text, dialogId) : "",
    dialog: dialogId,
    user: req.user.id,
    attachments: attachments ? attachments : null,
  });
  await message.save();
  dialog.lastMessage = message._id;
  await dialog.save();

  res.status(201).send();
});
