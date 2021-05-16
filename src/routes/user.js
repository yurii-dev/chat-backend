const express = require("express"),
  asyncHandler = require("express-async-handler"),
  { confirmEmail } = require("../resourses/mailer"),
  User = require("../models/User"),
  validator = require("email-validator"),
  { generateImage } = require("../resourses/imageGenerator");

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

    if (!username || username.length < 5) {
      error.username = "Ensure this field has at least 5 characters";
    }
    if (!password || password.length < 8) {
      console.log(password);
      error.password = "Ensure this field has at least 8 characters";
    }
    if (Object.keys(error).length > 0) {
      return res.status(400).json({ ...error });
    }
    const isExistUser = await User.findOne({ email });
    if (isExistUser) {
      return res.status(400).json({
        email: `The email address ${email} is used by another user`,
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
    user.confirmed = true;
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

// find by e-mail
router.get(
  "/find",
  asyncHandler(async (req, res) => {
    const { email } = req.body.user;
    if (!validator.validate(email)) {
      return res.status(400).json({ message: "Bad request" });
    }
    const user = await User.findOne({ email });
    if (!user || user.id === req.user.id) {
      return res.status(404).json({ message: "User not found" });
    }
    const newUser = sendingUserData(user);
    res.status(200).json({ user: { ...newUser } });
  })
);

module.exports = router;
