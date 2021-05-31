const asyncHandler = require("express-async-handler"),
  User = require("../../models/User"),
  Dialog = require("../../models/Dialog");

exports.find_users = asyncHandler(async (req, res) => {
  const { name } = JSON.parse(req.query.user);
  if (!name) {
    return res.status(400).send();
  }
  const regex = new RegExp(name, "i");

  let users = await User.find({
    username: { $regex: regex },
  }).and({ _id: { $ne: req.user.id }, confirmed: true });
  if (!users) {
    return res.status(404).json({ message: "User not found" });
  }
  let dialogs = await Dialog.find().or([
    { author: req.user.id },
    { partner: req.user.id },
  ]);

  if (dialogs.length > 0) {
    let knownUsers = [];
    users.forEach((user) => {
      dialogs.forEach((dialog) => {
        if (
          user._id.toString() === dialog.author.toString() ||
          user._id.toString() === dialog.partner.toString()
        ) {
          knownUsers.push(user);
        }
      });
    });
    let newUsers = users.filter((user) => !knownUsers.includes(user));
    const sendingData = newUsers.map((user) => user.sendingUserData());
    return res.status(200).json(sendingData);
  } else {
    const sendingData = users.map((user) => user.sendingUserData());

    return res.status(200).json(sendingData);
  }
});
