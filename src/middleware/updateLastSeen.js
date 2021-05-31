const express = require("express"),
  User = require("../models/User");

const updateLastSeen = async (req, res, next) => {
  if (req?.user?.id) {
    const userId = req.user.id;
    await User.findByIdAndUpdate(
      userId,
      {
        last_seen: new Date(),
      },
      {
        new: true,
      }
    );
  }
  next();
};
module.exports = updateLastSeen;
