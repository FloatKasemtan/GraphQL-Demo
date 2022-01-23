const createError = require("http-errors");
const express = require("express");
const port = 8080;
const { graphqlHTTP } = require("express-graphql");

const path = require("path");
const cookieParser = require("cookie-parser");

const schema = require("./schema/test");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// app.use(logger); global middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function auth(req, res, next) {
  if (req.query.admin === "true") {
    next();
    return;
  }
  res.status(500).send({ success: false, message: "Authentication required!" });
}

app.listen(port, () => {
  console.log(`This app listening on port ${port}`);
});

module.exports = app;
