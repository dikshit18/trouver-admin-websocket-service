const AWS = require("aws-sdk");
require("dotenv").config();
AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});
const cognitoClient = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});
/*
Module pattern interface the methods from the global space and provide modularity
*/
const cognito = (() => {
  return {
    refreshTokens: REFRESH_TOKEN => {
      const params = {
        AuthFlow: "REFRESH_TOKEN_AUTH",
        UserPoolId: process.env.USER_POOL_ID,
        ClientId: process.env.USER_POOL_CLIENT_ID,
        AuthParameters: {
          REFRESH_TOKEN
        }
      };
      return new Promise((res, rej) => {
        cognitoClient.adminInitiateAuth(params, (err, data) => {
          if (err) {
            console.log("Error while signing in... ", err);
            rej(err);
          } else {
            console.log("SignIn done.");
            res(data.AuthenticationResult);
          }
        });
      });
    }
  };
})();
module.exports = { cognito };
