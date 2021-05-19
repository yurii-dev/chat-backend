const { model, Schema } = require("mongoose"),
  bcrypt = require("bcryptjs"),
  { isEmail } = require("validator"),
  jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "can't be blank"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: [isEmail, "Invalid e-mail address"],
    },
    username: {
      type: String,
      required: [true, "can't be blank"],
      minlength: 4,
    },
    password: {
      type: String,
      required: [true, "can't be blank"],
      minlength: 8,
    },
    avatar: String,
    last_seen: {
      type: Date,
      default: new Date(),
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    confirm_hash: String,
  },
  {
    timestamps: true,
  }
);

// login
userSchema.statics.findByCredentials = async (email, password, next) => {
  const user = await User.findOne({ email });
  if (!user) {
    return null;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return null;
  }
  return user;
};

// generation of token
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    { id: this._id, username: this.username, email: this.email },
    process.env.SECRET_KEY,
    {
      expiresIn: "1 day",
    }
  );
};

// data for sendind to client
userSchema.methods.toAuthJSON = function () {
  return {
    id: this.id,
    username: this.username,
    email: this.email,
    last_seen: this.last_seen,
    createdAt: this.createdAt,
    avatar: this.avatar,
    updatedAt: this.updatedAt,
    token: this.generateJWT(),
  };
};

//Hash password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// Generate a confir_hash value
userSchema.methods.generateHash = async function () {
  return (confirm_hash = await bcrypt.hash(new Date().toISOString(), 8));
};
const User = model("User", userSchema);

module.exports = User;
