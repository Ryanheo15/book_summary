// ---------------- INIT ----------------------

//general
let express = require("express");
let ejs = require("express");
let mongoose = require("mongoose");
let bodyParser = require("body-parser");
let methodOverride = require("method-override");
let validator = require("validator");
let http = require("http");
let socketio = require("socket.io");
let multer = require("multer");

//passport require
let passport = require("passport");
let localStrategy = require("passport-local").Strategy;
let passportLocalMongoose = require("passport-local-mongoose");
let expressSession = require("express-session");

//routes
let bookRoute = require("./routes/books.js");
let commentRoute = require("./routes/comments.js");
let messageRoute = require("./routes/messageRoute.js");
let indexRoute = require("./routes/index.js");

//mongoose
mongoose.connect("mongodb://localhost:27017/book_notes_app", {useNewUrlParser: true, useUnifiedTopology: true});

//models
let userModel = require("./models/userModel.js");

//app setup
let app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

//server setup
let server = http.createServer(app);
let io = socketio(server);

//passport setup
app.use(expressSession({
  secret: "xhyszerkfoajsjdffhafni39djs",
  resave: false,
  saveUninitialized: false
}));

//initializes authentication model
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

//multer configuration

//local variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

//Global variables

//JS files
let userJs = require("./public/js/users.js");

// ---------------- ROUTES ----------------------
app.use(bookRoute);
app.use(commentRoute);
app.use(messageRoute);
app.use(indexRoute);

// ---------------- SOCKET IO ----------------
io.on("connection", (socket) => {
  //Emit events

  //On events
  socket.on("sendMessage",(message) => {
    let id = socket.id;
    let user = userJs.getUser(id);

    console.log(message);
    console.log(user);

  });

  socket.on("join", (room) => {
    let id = socket.id;
    let user = userJs.addUser(room, id);

    socket.join(room);

    io.to(room).emit("newUser", "New user has joined room " + room );
  });

  socket.on("disconnect", () => {
    let id = socket.id;

    let removedUser = userJs.deleteUser(id);

    io.to(removedUser.room).emit("userLeft", "User has left room " + removedUser.room);
  });
});

// ---------------- LISTEN ----------------------
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
