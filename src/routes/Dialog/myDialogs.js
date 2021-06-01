const asyncHandler = require("express-async-handler"),
  Dialog = require("../../models/Dialog"),
  { decryptText } = require("../../resourses/messageEncrypting");

exports.my_dialogs = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  let dialogs = await Dialog.find()
    .or([{ author: userId }, { partner: userId }])
    .populate({
      path: "author",
      select: ["email", "username", "avatar", "last_seen"],
    })
    .populate({
      path: "partner",
      select: ["email", "username", "avatar", "last_seen"],
    })
    .populate({
      path: "lastMessage",
      select: ["text", "createdAt", "read", "user"],
    });
  dialogs.map((dialog) => {
    dialog.lastMessage.text = decryptText(dialog.lastMessage.text, dialog._id);
  });
  res.status(200).json({ dialogs });
});
