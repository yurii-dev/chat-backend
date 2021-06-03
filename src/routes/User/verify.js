const asyncHandler = require("express-async-handler"),
  User = require("../../models/User");

exports.verify = asyncHandler(async (req, res) => {
  const hash = req.query.hash;
  if (!hash) {
    return res.status(422).json({ message: "Invalid hash" });
  }
  let user = await User.findOne({ confirm_hash: hash });
  if (!user) {
    return res.status(404).json({ error: { message: "Hash not found" } });
  }
  if (user.confirmed) {
    return res.status(400).json({ error: { message: "Already confirmed" } });
  }
  user.confirmed = true;
  user.confirm_hash = null;
  await user.save();
  res.status(200).redirect(`${process.env.UIURI}login`);
});
