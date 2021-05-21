const express = require("express"),
  asyncHandler = require("express-async-handler"),
  { confirmEmail } = require("../resourses/mailer"),
  User = require("../models/User"),
  validator = require("email-validator"),
  { multerUploads, parser } = require("../middleware/multer"),
  sharp = require("sharp"),
  { generateImage } = require("../resourses/imageGenerator");
const Dialog = require("../models/Dialog");

const router = express.Router();

const sendingUserData = (user) => {
  const newUser = {};
  newUser.id = user.id;
  newUser.email = user.email;
  newUser.username = user.username;
  newUser.last_seen = user.last_seen;
  newUser.createdAt = user.createdAt;
  newUser.avatar = user.avatar;
  newUser.updatedAt = user.updatedAt;
  return newUser;
};
//about me
router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const me = await User.findById(req.user.id);
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }
    const newUser = sendingUserData(me);
    res.status(200).json({ user: { ...newUser } });
  })
);

// register
router.post(
  "/signup",
  asyncHandler(async (req, res) => {
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
    const avatar = await generateImage(username);
    user.avatar = avatar;
    user = await user.save();
    // production
    // confirmEmail(user.email, user.username, user.confirm_hash);
    // res.sendStatus(201);
    // development
    // confirmEmail(user.email, user.username, user.confirm_hash);
    res.status(200).send();
  })
);

// verify
router.get(
  "/verify",
  asyncHandler(async (req, res) => {
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
    res.status(200).send();
  })
);

// login
router.post(
  "/signin",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body.user;
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (user.confirmed === false) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ user: user.toAuthJSON() });
  })
);

// delete me
router.delete(
  "/me",
  asyncHandler(async (req, res) => {
    const me = await User.findById(req.user.id);
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }
    await me.remove();
    res.sendStatus(200);
  })
);

// edit username
router.patch(
  "/me/username",
  asyncHandler(async (req, res) => {
    const { username = null } = req.body.user;
    if (!username) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (username.length < 4) {
      return res
        .status(400)
        .json({ message: "Ensure this field has at least 4 characters" });
    }
    const isExistUserbyUserame = await User.findOne({ username });
    if (isExistUserbyUserame) {
      return res.status(400).json({
        email: `The username:'${username}' is already exist`,
      });
    }
    const me = await User.findById(req.user.id);
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }
    me.username = username;
    await me.save();
    res.status(201).json(sendingUserData(me));
  })
);

// edit password
router.patch(
  "/me/password",
  asyncHandler(async (req, res) => {
    const { password = null } = req.body.user;

    if (!password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (password.trim().length < 8) {
      return res
        .status(400)
        .json({ message: "Ensure this field has at least 8 characters" });
    }
    const me = await User.findById(req.user.id);
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }

    me.password = password;
    await me.save();
    res.status(201).send();
  })
);

// upload avatar
router.patch(
  "/me/avatar",
  multerUploads.single("avatar"),
  asyncHandler(async (req, res) => {
    if (!req.file || !req.file.buffer) {
      return res.status(400).send("File is not selected");
    }
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 40,
        height: 40,
      })
      .toBuffer();

    if (!buffer) {
      return res.status(400).send("Please upload an image");
    }
    const me = await User.findById(req.user.id);
    if (!me) {
      return res.status(404).json({ message: "User not found" });
    }
    avatar = `data:image/png;base64,${buffer.toString("base64")}`;
    me.avatar = avatar;
    await me.save();
    res.status(201).json(sendingUserData(me));
  })
);

// find users
router.get(
  "/find",
  asyncHandler(async (req, res) => {
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
      const sendingData = newUsers.map((user) => sendingUserData(user));
      return res.status(200).json(sendingData);
    } else {
      const sendingData = users.map((user) => sendingUserData(user));
      return res.status(200).json(sendingData);
    }
  })
);

//forgot password, generate hash
router.get(
  "/forgotpassword",
  asyncHandler(async (req, res) => {
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
    // send hash to the ${email} e-mail
    await user.save();
    res.status(200).send();
  })
);

//forgot password, change password
router.post(
  "/forgotpassword",
  asyncHandler(async (req, res) => {
    const { token: hash = null } = req.query;
    const { password = null } = req.body;
    if (!hash) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!password || password.trim().length < 8) {
      return res
        .status(400)
        .json({ message: "Ensure this field has at least 8 characters" });
    }
    const user = await User.findOne().and({
      reset_password_hash: hash,
      confirmed: true,
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    let date = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;
    if (user.reset_password_date < date) {
      return res.status(400).json({ message: "Time is expired" });
    }
    user.password = password;
    user.reset_password_hash = null;
    user.reset_password_date = null;
    await user.save();
    res.status(201).send();
  })
);

module.exports = router;
