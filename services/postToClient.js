require("dotenv").config();
const AWS = require("aws-sdk");
// AWS.config.update({
//   region: "ap-south-1",
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
// });
const apigwManagementApi = new AWS.ApiGatewayManagementApi({
  apiVersion: "2018-11-29",
  endpoint: process.env.WEB_SOCKET_ENDPOINT,
  region: "ap-south-1"
});

exports.postToClient = (connectionId, message) => {
  return new Promise((res, rej) => {
    const params = {
      ConnectionId: connectionId,
      Data: JSON.stringify(message)
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
