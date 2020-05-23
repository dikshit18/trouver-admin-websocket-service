require("dotenv").config();
const AWS = require("aws-sdk");

const apigwManagementApi = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: process.env.WEB_SOCKET_ENDPOINT,
  region: "ap-southeast-2"
});

exports.postToClient = (connectionId, message) => {
  return new Promise((res, rej) => {
    const params = {
      ConnectionId: connectionId,
      Data: JSON.stringify(message || { connectionId: connectionId })
    };
    apigwManagementApi.postToConnection(params, (err, data) => {
      if (err) {
        rej({ ...err, origin: "APIG" });
      } else {
        console.log("Message sent...", connectionId, message);
        res(data);
      }
    });
  });
};
