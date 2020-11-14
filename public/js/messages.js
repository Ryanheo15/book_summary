//General Variabels
let socket = io();

//Seletors
let messageForm = $(".messageForm");
let message = $(".message");
let userCount = $("#userCount");
let newUser = $("#newUser");
let rooms = $(".room");
let messageContent = $("#messageContent");


//Ready
$(document).ready(() => {
  //default
  socket.emit("join", "Room 1");
  //Event Listeners
  //fetch request to get room
  rooms.click(() => {
    let roomName = $(event.target).text();
    roomQuery = roomName.replace(" ", "+");
    /*
    fetch("http://localhost:3000/room?name=" + roomName).then((res) => {
      return res.text();
    }).then((res_data) => {
      console.log(res_data);
    }).catch((err) => {
      if(err){
        console.log(err);
      }
    });
    */
    socket.emit("join", roomName);
  });

  //sending message
  messageForm.submit((e) => {
    e.preventDefault();
    socket.emit("sendMessage", message.val());

    //clearing input
    message.val("");
    message.focus();
  });

  //Socket Events
  socket.on("newUser", (message) => {
    let messageTxt = document.createElement("p");
    messageTxt.innerHTML = `<p><b class = "text-dark">Admin: </b>${message}`;
    messageContent.prepend(messageTxt);
  });

  socket.on("userLeft", (message) => {
    console.log(message);
    let messageTxt = document.createElement("p");
    messageTxt.innerHTML = `<p><b class = "text-dark">Admin: </b>${message}`;
    messageContent.prepend(messageTxt);
  });














  /*
  socket.on("join", (count) => {
    newUser.removeClass("d-none");
    setTimeout(() => {
      newUser.addClass("d-none");
    }, 1500);

    userCount.text("User Count: " + count);
  });
  */
});
