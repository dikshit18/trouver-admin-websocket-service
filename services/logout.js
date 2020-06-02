require("dotenv").config();
const { dynamoDb } = require("../dbConfig/dynamoDb");
const { postToClient } = require("./postToClient");
const { emailFromToken } = require("../utils/auth");

exports.logout = async sessionId => {
  //const email = emailFromToken(authorization);
  const connectionIds = await getConnectionIds(sessionId);
  const message = { dispatch: "logout" };
  for (const id of connectionIds) {
    try {
      await postToClient(id, message);
    } catch (error) {
      if (error.code === "GoneException") {
        await deleteInvalidConnections(id, email);
      }
    }
  }
};

const getConnectionIds = async sessionId => {
  const params = {
    TableName: process.env.ADMIN_WS_CONNECTION_TABLE,
    KeyConditionExpression: "sessionId = :sessionId",
    ExpressionAttributeValues: {
      ":sessionId": sessionId
    },
    IndexName: "sessionId-connectionId-index",
    ProjectionExpression: "connectionId"
  };
  const sessions = await dynamoDb.query(params);
  return sessions.Items.map(session => session.connectionId);
};

const deleteInvalidConnections = async id => {
  const params = {
    TableName: process.env.ADMIN_WS_CONNECTION_TABLE,
    Key: {
      connectionId: id
    }
  };
  await dynamoDb.delete(params);
};
