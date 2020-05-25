require("dotenv").config();
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
var jwt = require("jsonwebtoken");
const { postToClient } = require("./postToClient");
const { dynamoDb } = require("../dbConfig/dynamoDb");
const { cognito } = require("../cognitoConfig/cognito");
//const moment = require("moment");
exports.init = async (connectionId, authorization, sessionId, callback) => {
  try {
    const clientMessage = {
      sessionStatus: "old"
    };
    const sessionDetails = await fetchSessionDetails(sessionId);
    if (!sessionDetails) {
      console.log(`SessionId ${sessionId} not found.`);
      //callback({ statusCode: 401, body: "Unauthorized" }, null);
    }
    const { refreshToken, created } = sessionDetails.Item;

    const currentTime = moment();
    const expiryTime = moment(created).add(1, "hour");
    const timeDifference = moment
      .duration(currentTime.diff(expiryTime))
      .asMinutes();
    const email = emailFromToken(authorization);
    if (timeDifference < 5) {
      console.log("Refreshing sessions now");
      const tokens = await generateNewTokens(refreshToken);
      console.log(tokens);
      clientMessage["tokens"] = tokens;
      clientMessage["sessionId"] = uuidv4();
      client["sessionStatus"] = "new";
      await pushNewSession(
        clientMessage.sessionId,
        clientMessage.tokens.accessToken,
        moment()
          .utc()
          .format(),
        email,
        clientMessage.tokens.idToken,
        clientMessage.tokens.refreshToken
      );
      await deleteExpiredSession(sessionId);
    }
    await saveConnectionDetails(
      email,
      connectionId,
      clientMessage.sessionId || sessionId
    );
    console.log("Connection details saved");
    await postToClient(connectionId, clientMessage);
  } catch (error) {
    if (error.code === "GoneException")
      await deleteInvalidConnection(connectionId);
  }
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify("connected")
  });
};

const deleteInvalidConnection = async connectionId => {
  const params = {
    TableName: process.env.ADMIN_WS_CONNECTION_TABLE,
    Key: {
      connectionId
    }
  };
  await dynamoDb.delete(params);
};

const deleteExpiredSession = async sessionId => {
  const params = {
    TableName: process.env.ADMIN_SESSIONS_TABLE,
    Key: {
      sessionId
    }
  };
  await dynamoDb.delete(params);
};

const fetchSessionDetails = async sessionId => {
  const params = {
    TableName: process.env.ADMIN_SESSIONS_TABLE,
    Key: {
      sessionId
    }
  };
  const sessionDetails = await dynamoDb.get(params);
  return sessionDetails;
};
const saveConnectionDetails = async (email, connectionId, sessionId) => {
  const params = {
    TableName: process.env.ADMIN_WS_CONNECTION_TABLE,
    Item: {
      connectionId,
      sessionId,
      email,
      created: moment.utc().format()
    }
  };
  await dynamoDb.create(params);
};

const generateNewTokens = async refreshToken => {
  return await cognito.refreshTokens(refreshToken);
};

const emailFromToken = idToken => {
  const decodedToken = jwt.decode(idToken);
  console.log("DecodedToken... ", decodedToken);
  return decodedToken.email;
};

const pushNewSession = async (
  sessionId,
  accessToken,
  created,
  email,
  idToken,
  refreshToken
) => {
  const params = {
    TableName: process.env.ADMIN_SESSIONS_TABLE,
    Item: {
      accessToken,
      idToken,
      refreshToken,
      created,
      email,
      sessionId
    }
  };
  return await dynamoDb.create(params);
};
