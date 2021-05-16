const { model, Schema } = require("mongoose");

const uploadSchema = new Schema(
  {
    filename: String,
    size: Number,
    ext: String,
    url: String,
    message: { type: Schema.Types.ObjectId, ref: "Message" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);
const UploadFile = model("UploadFile", uploadSchema);

module.exports = UploadFile;
