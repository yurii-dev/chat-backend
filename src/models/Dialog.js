const { model, Schema } = require("mongoose");

const dialogSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    partner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  }
);
const Dialog = model("Dialog", dialogSchema);

module.exports = Dialog;
