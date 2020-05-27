require("dotenv").config();
const { dynamoDb } = require("../dbConfig/dynamoDb");

const logout = authorization => {};

const getAllSessions = async email => {
  //Write scan operation here
  const params = {
    TableName: process.env.ADMIN_SESSIONS_TABLE,
    KeyConditionExpression: "HashKey = :hkey and RangeKey > :rkey",
    ExpressionAttributeValues: {
      ":hkey": "key",
      ":rkey": 2015
    }
  };
  //To be done yet
  const sessions = await dynamoDb.query(params);
};
