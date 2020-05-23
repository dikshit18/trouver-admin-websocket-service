const { connect } = require("./services/connect");
const { init } = require("./services/init");
exports.handler = function(event, context, callback) {
  console.log("Event from Lambda Trigger: ", JSON.stringify(event));
  const connectionId = event.requestContext.connectionId;
  const { routeKey } = event.requestContext;

  switch (routeKey) {
    case "$connect":
      connect(callback);
      break;
    case "init":
      const authorization = event.queryStringParameters.authorization;
      if (!authorization)
        callback({
          statusCode: 400,
          body: JSON.stringify("Authentication failed")
        });
      init(connectionId, authorization, callback);
      break;
    case "$disconnect":
      //Not to be called by AWS as it is not gauranteed
      break;
    default:
      break;
  }
};
