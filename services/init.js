const { postToClient } = require("./postToClient");
const { getUndeliveredMessages } = require("../db/notificationQuery");
const moment = require("moment");
exports.init = async (authorization, callback) => {
  try {
    await postToClient(newConnectionId, clientMessage);
  } catch (error) {
    if (error.code === "GoneException")
      deleteInvalidConnection(newConnectionId);
  }
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify("connected")
  });
};

const deleteInvalidConnection = async connectionId => {
  try {
    await deleteNotificationConnection(connectionId);
  } catch (e) {}
};

const isSessionExpiring = sessionId => {};
