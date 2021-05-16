module.exports = (mongoose, isProduction) => {
  if (isProduction) {
    mongoose.connect(
      process.env.MONGODB,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
      () => {
        console.log("MongoDB connected");
      }
    );
  } else {
    mongoose.connect(
      process.env.MONGODB_DEV,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
      () => {
        console.log("MongoDB connected");
      }
    );
  }
};
