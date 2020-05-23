const { postToClient } = require("./postToClient");
const { getUndeliveredMessages } = require("../db/notificationQuery");
const moment = require("moment");
exports.init = async (connectionId, authorization, callback) => {
  console.log("Inside init...");
  const { tenantId, communityId } = decodedToken;

  console.log("Creating new client...", newConnectionId);
  await saveNotificationConnection({
    tenantId,
    communityId,
    connectionId: newConnectionId
  });
  console.log("CLient Created", newConnectionId);
  try {
    await postToClient(newConnectionId);
  } catch (error) {
    if (error.code === "GoneException")
      deleteInvalidConnection(newConnectionId);
  }
  // }
  const undeliveredNotifications = await getUndeliveredMessages(
    tenantId,
    communityId
  );
  const count = undeliveredNotifications.length;
  let today = [],
    yesterday = [],
    older = [];

  if (count) {
    for (const item of undeliveredNotifications) {
      if (moment(item.created).isSame(moment(), "day")) {
        today.push(item);
      } else if (
        moment(item.created).isSame(
          moment()
            .utc()
            .subtract(1, "day"),
          "day"
        )
      )
        yesterday.push(item);
      else older.push(item);
    }
    console.log("1", today);
    console.log("2", yesterday);
    console.log("3", older);
  }
  const clientMessage = {
    connectionId: newConnectionId,
    data: {
      count,
      notifications: {
        today,
        yesterday,
        older
      }
    }
  };
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
