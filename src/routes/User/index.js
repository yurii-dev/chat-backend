const express = require("express"),
  { about_me } = require("./aboutMe"),
  { register } = require("./register"),
  { verify } = require("./verify"),
  { login } = require("./login"),
  { delete_me } = require("./deleteMe"),
  { edit_username } = require("./editUsername"),
  { edit_password } = require("./editPassword"),
  { upload_avatar } = require("./uploadAvatar"),
  { find_users } = require("./findUsers"),
  { forgot_password_hash } = require("./forgotPasswordHash"),
  { forgot_password_change } = require("./forgotPassowrdChange");

const router = express.Router();

//about me
router.get("/me", about_me);

// register
router.post("/signup", register);

// verify
router.get("/verify", verify);

// login
router.post("/signin", login);

// delete me
router.delete("/me", delete_me);

// edit username
router.patch("/me/username", edit_username);

// edit password
router.patch("/me/password", edit_password);

// upload avatar
router.patch("/me/avatar", upload_avatar);

// find users
router.get("/find", find_users);

//forgot password, generate hash, send e-mail
router.get("/forgotpassword", forgot_password_hash);

//forgot password, change password
router.post("/forgotpassword", forgot_password_change);

module.exports = router;
