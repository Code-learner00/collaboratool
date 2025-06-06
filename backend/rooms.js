const rooms = {}; // { roomId: { ownerId, users: [ { id, username } ] } }

function addUserToRoom(roomId, user, isOwner = false) {
  if (!rooms[roomId]) {
    rooms[roomId] = { ownerId: isOwner ? user.id : null, users: [] };
  }
  if (isOwner) {
    rooms[roomId].ownerId = user.id;
  }
  rooms[roomId].users.push(user);
}

function removeUserFromRoom(socketId) {
  for (const [roomId, room] of Object.entries(rooms)) {
    const index = room.users.findIndex((user) => user.id === socketId);
    if (index !== -1) {
      const [removedUser] = room.users.splice(index, 1);

      // 🚨 If user is owner, delete whole room
      if (room.ownerId === socketId) {
        delete rooms[roomId];
        return { roomId, user: removedUser, deletedRoom: true };
      }

      // If room is empty, delete it
      if (room.users.length === 0) {
        delete rooms[roomId];
      }

      return { roomId, user: removedUser, deletedRoom: false };
    }
  }
  return null;
}

function getRoomUsers(roomId) {
  return rooms[roomId]?.users || [];
}

module.exports = {
  addUserToRoom,
  removeUserFromRoom,
  getRoomUsers,
};
