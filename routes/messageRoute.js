let express = require("express");
let router = express.Router();

router.get("/messages", (req, res) => {
  res.render("messages.ejs");
});

router.get("/room", (req, res) => {
  res.send("Hello");
});

module.exports = router;
