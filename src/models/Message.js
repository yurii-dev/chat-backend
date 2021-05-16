const { model, Schema } = require("mongoose");

const messageSchema = new Schema(
  {
    text: { type: String, require: true },
    dialog: { type: Schema.Types.ObjectId, ref: "Dialog", require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    read: {
      type: Boolean,
      default: false,
    },
    attachments: { type: Schema.Types.ObjectId, ref: "UploadFile" },
  },
  {
    timestamps: true,
    usePushEach: true,
  }
);
const Message = model("Message", messageSchema);

module.exports = Message;
