const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  updateLastSeen = require("./middleware/updateLastSeen"),
  auth = require("./middleware/auth");

const isProduction = process.env.NODE_ENV === "production";
// Create global app object
const app = express();

// Normal express config defaults
app.use(express.json());
app.use(cors());

//middlewares
app.use(auth);
app.use(updateLastSeen);

// database connection
require("./db")(mongoose, isProduction);

//models
require("./models/User");
require("./models/Dialog");
require("./models/Message");

//routes
app.use(require("./routes"));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function (error, req, res, next) {
    res.status(error.status || 500);
    res.json({
      status: error.status,
      message: error.message,
      stack: error.stack,
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (error, req, res, next) {
  res.status(error.status || 500);
  res.json({
    status: error.status,
    message: error.message,
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
