const asyncHandler = require("express-async-handler"),
  { confirmEmail } = require("../../resourses/mailer"),
  User = require("../../models/User"),
  validator = require("email-validator"),
  { generateImage } = require("../../resourses/imageGenerator");

exports.register = asyncHandler(async (req, res) => {
  let error = {};
  const { username, password, email } = req.body.user;
  if (!validator.validate(email)) {
    error.email = "Incorect e-mail";
  }

  if (!username || username.length < 4) {
    error.username = "Ensure this field has at least 4 characters";
  }
  if (!password || password.trim().length < 8) {
    error.password = "Ensure this field has at least 8 characters";
  }
  if (Object.keys(error).length > 0) {
    return res.status(400).json({ ...error });
  }
  const isExistUserbyEmail = await User.findOne({ email });
  if (isExistUserbyEmail) {
    return res.status(400).json({
      email: `The email address ${email} is used by another user`,
    });
  }
  const isExistUserbyUserame = await User.findOne({ username });
  if (isExistUserbyUserame) {
    return res.status(400).json({
      email: `The username:'${username}' is already exist`,
    });
  }
  let user = new User({
    username,
    email,
    password,
  });
  user.confirm_hash = await user.generateHash();
  user.avatar = await generateImage(username);
  await user.save();
  confirmEmail(user.email, user.confirm_hash);
  res.status(200).send();
});
