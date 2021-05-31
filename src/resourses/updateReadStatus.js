const Message = require("../models/Message");

exports.updateReadStatus = async (dialogId, userId, next) => {
  try {
    await Message.updateMany(
      {
        dialog: dialogId,
        user: { $ne: userId },
      },
      {
        $set: { read: true },
      }
    );
  } catch (error) {
    next(error);
  }
};
