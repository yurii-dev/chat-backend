const asyncHandler = require("express-async-handler"),
  Dialog = require("../../models/Dialog"),
  User = require("../../models/User"),
  Message = require("../../models/Message"),
  { encryptText } = require("../../resourses/messageEncrypting");

const createMessage = async (text, dialogId, userId, attachments, dialog) => {
  const message = new Message({
    text: text ? encryptText(text, dialogId) : "",
    dialog: dialogId,
    user: userId,
    attachments: !attachments || attachments.length == 0 ? [] : attachments,
  });
  await message.save();
  dialog.lastMessage = message._id;
  await dialog.save();
};
//
exports.create_message = asyncHandler(async (req, res) => {
  const { partnerId = null, text = null, attachments = null } = req.body.message;
  // Validation of req parameters
  if (!((typeof text === "string" && text.trim().length > 0) || (Array.isArray(attachments) && attachments.length > 0))) {
    return res.status(400).json({ message: "Invalid data" });
  }
  if (!partnerId || partnerId === req.user.id) {
    return res.sendStatus(404);
  }
  const partner = await User.findById(partnerId);
  if (!partner) {
    return res.sendStatus(404);
  }

  const dialog = await Dialog.findOne().or([
    {
      author: req.user.id,
      partner: partner._id,
    },
    {
      author: partner._id,
      partner: req.user.id,
    },
  ]);

  if (dialog) {
    await createMessage(text, dialog._id, req.user.id, attachments, dialog);
    res.status(201).send();
  } else {
    const dialog = new Dialog({
      author: req.user.id,
      partner: partner._id,
    });
    await dialog.save();
    await createMessage(text, dialog._id, req.user.id, attachments, dialog);
    res.status(201).send();
  }
});
