require("dotenv").config();
const { dynamoDb } = require("../dbConfig/dynamoDb");
const { postToClient } = require("./postToClient");
const { emailFromToken } = require("../utils/auth");

exports.logout = async authorization => {
  const email = emailFromToken(authorization);
  const connectionIds = await getConnectionIds(email);
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

const getConnectionIds = async email => {
  const params = {
    TableName: process.env.ADMIN_WS_CONNECTION_TABLE,
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    },
    ProjectionExpression: "connectionId"
  };
  const sessions = await dynamoDb.query(params);
  return sessions.Items.map(session => session.connectionId);
};

const deleteInvalidConnections = async (id, email) => {
  const params = {
    TableName: process.env.ADMIN_WS_CONNECTION_TABLE,
    Key: {
      email,
      connectionId: id
    }
  };
  await dynamoDb.delete(params);
};
