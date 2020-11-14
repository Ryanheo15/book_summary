let users = [];

let userMethods = {};

userMethods.addUser = (room, userId) => {
  //let trimmed_room = room.trim().toLowerCase();

  let existingUser = users.find((user) => {
    return user.id === userId;
  });

  if(existingUser){
    return {
      error: "User already exists"
    }
  }
  else {
    let user = {id: userId, room: room};
    users.push(user);

    return user;
  }
}

userMethods.deleteUser = (userId) => {
  let m_index = users.findIndex((user) => {
    return user.id === userId;
  });

  if (m_index !== -1){
    return users.splice(m_index,1)[0];
  }
  else {
    return {
      error: "User not found"
    }
  }
}

userMethods.getUser = (userId) => {
  let user = users.find((user) => {
    return user.id === userId;
  });

  if(!user){
    return {
      error: "Not found"
    }
  }
  else {
    return user;
  }
}

userMethods.getRoomUsers = (room) => {
  let filteredUsers = users.filter((user) => {
    return user.room === room;
  });

  if(!filteredUsers){
    return {
      error: "No users in room"
    }
  }
  else {
    return filteredUsers;
  }
}

module.exports = userMethods;
