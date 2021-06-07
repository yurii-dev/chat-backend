const asyncHandler = require("express-async-handler"),
  User = require("../../models/User"),
  { deleteAccountEmail } = require("../../resourses/mailer");

exports.delete_me = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user.id);
  if (!me) {
    return res.status(404).json({ message: "User not found" });
  }
  await me.remove();
  deleteAccountEmail(me.email);
  res.sendStatus(200);
});
