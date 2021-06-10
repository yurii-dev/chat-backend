const Message = require("../models/Message");

exports.updateReadStatus = async (dialogId, userId, next) => {
  try {
    await Message.update(
      {
        dialog: dialogId,
        user: { $ne: userId },
        read: false,
      },
      {
        $set: { read: true },
      },
      {
        multi: true,
      }
    );
  } catch (error) {
    next(error);
  }
};
