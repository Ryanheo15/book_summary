//General Variabels
let socket = io();

//Seletors
let messageForm = $(".messageForm");
let message = $(".message");
let userCount = $("#userCount");
let newUser = $("#newUser");


//Ready
$(document).ready(() => {
  //Event Listeners
  messageForm.submit((e) => {
    e.preventDefault();
    socket.emit("message", message.val());
  });

  //Socket Events
  socket.on("join", (count) => {
    newUser.removeClass("d-none");
    setTimeout(() => {
      newUser.addClass("d-none");
    }, 1500);

    userCount.text("User Count: " + count);
  });
});
