const rooms = {};

function addUserToRoom(roomId, user) {
  if (!rooms[roomId]) rooms[roomId] = [];
  rooms[roomId].push(user);
}

function removeUserFromRoom(socketId) {
  for (const [roomId, users] of Object.entries(rooms)) {
    const index = users.findIndex((user) => user.id === socketId);
    if (index !== -1) {
      const [removedUser] = users.splice(index, 1);
      if (users.length === 0) delete rooms[roomId];
      return { roomId, user: removedUser };
    }
  }
  return null;
}

function getRoomUsers(roomId) {
  return rooms[roomId] || [];
}

module.exports = {
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
};
