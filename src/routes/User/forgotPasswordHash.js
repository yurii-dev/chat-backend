const asyncHandler = require("express-async-handler"),
  { resetPasswordEmail } = require("../../resourses/mailer"),
  User = require("../../models/User"),
  validator = require("email-validator");

exports.forgot_password_hash = asyncHandler(async (req, res) => {
  const { email = null } = req.query;
  if (!validator.validate(email)) {
    return res.status(200).send();
  }
  const user = await User.findOne().and({ email, confirmed: true });
  if (!user) {
    return res.status(200).send();
  }
  user.reset_password_hash = await user.generateHash();
  user.reset_password_date = new Date();
  resetPasswordEmail(user.email, user.username, user.reset_password_hash);
  await user.save();
  res.status(200).send();
});
