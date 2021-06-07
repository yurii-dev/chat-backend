const asyncHandler = require("express-async-handler"),
  Dialog = require("../../models/Dialog"),
  User = require("../../models/User"),
  Message = require("../../models/Message"),
  UploadFile = require("../../models/UploadFile"),
  { encryptText } = require("../../resourses/messageEncrypting");

exports.create_message = asyncHandler(async (req, res) => {
  // Validation of req parameters
  const {
    partnerId = null,
    text = null,
    attachments = null,
  } = req.body.message;

  if (!partnerId) {
    return res.status(400).json({ message: "Invalid data" });
  }
  if (!attachments && !text) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const partner = await User.findById(partnerId);
  if (!partner) {
    return res.sendStatus(404);
  }
  if (partnerId === req.user.id) {
    return res.status(400).json({ message: "Invalid data" });
  }
  if (attachments) {
    let attachedFile = await UploadFile.findById(attachments);
    if (!attachedFile) {
      return res.status(400).json({ message: "Invalid data" });
    }
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
    // create a message
    const message = new Message({
      text: text ? encryptText(text, dialog._id) : "",
      dialog: dialog._id,
      user: req.user.id,
      attachments: attachments ? attachments : null,
    });
    await message.save();
    dialog.lastMessage = message._id;
    await dialog.save();

    res.status(201).send();
  } else {
    //create a dialog
    const dialog = new Dialog({
      author: req.user.id,
      partner: partner._id,
    });

    await dialog.save();

    const message = new Message({
      text: text ? encryptText(text, dialog._id) : "",
      dialog: dialog._id,
      user: req.user.id,
      attachments: attachments ? attachments : null,
    });

    await message.save();
    dialog.lastMessage = message._id;
    await dialog.save();
    res.status(201).send();
  }
});
