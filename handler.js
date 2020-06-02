const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const { connect } = require("./services/connect");
const { init } = require("./services/init");
const { logout } = require("./services/logout");
exports.handler = function(event, context, callback) {
  console.log("Event from Lambda Trigger: ", JSON.stringify(event));
  const connectionId = event.requestContext.connectionId;
  const { routeKey } = event.requestContext;
  const { body } = event;

  // if (!authorization) {
  //   callback(
  //     {
  //       statusCode: 401,
  //       body: "Unauthorized"
  //     },
  //     null
  //   );
  // }
  switch (routeKey) {
    case "$connect":
      connect(callback);
      break;
    case "init":
      const parsedBody = JSON.parse(body);
      const { sessionId, authorization } = parsedBody;
      init(connectionId, authorization, sessionId, callback);
      break;
    case "logout":
      const parsedBody = JSON.parse(body);
      const { sessionId, authorization } = parsedBody;
      logout(sessionId);
      break;
    case "$disconnect":
      //Not to be called by AWS as it is not gauranteed
      break;
    default:
      break;
  }
};

// const isJWTValid = token => {
//   try {
//     const jwk = {
//       keys: [
//         {
//           alg: "RS256",
//           e: "AQAB",
//           kid: "SGy1+j3JJooYb7N285zhSCLTqM5iacyrGWyaHU5BOWg=",
//           kty: "RSA",
//           n:
//             "hlOlRWSJxRDrdJ93M5rqDTOxHIUJv0U-5hQ9ABJGVh8_qYPzG3E9bAMY8y3Vh_PnKQ7VvBkaizW9QBqCfrAYLKw3dFJraRL34qnVVmwYDi8MaQRnC8WiSbYrqCEO8Z2L9O1McODq-THeu18B0NEkZgbwHjKvLICeqx2YYIHmmetVAC2guifFRW-VJZA5yi3Gup1XrGIe074YcaeZGlsItwpfiTMEPhU1W3NHwQlPxGQnikBDZWoGX-SDpmHTuktPacdRLjUCvTTYFiFcxshGcIEiQizUmIjgw7lSMHX_K9yFTQhRJd5EP00_sKL3xYTenjjYljg1lCinPryNuRonnw",
//           use: "sig"
//         },
//         {
//           alg: "RS256",
//           e: "AQAB",
//           kid: "TqmuH7/dHuJdk/oa8mQWYUvNmUFZHWG0hFbR1qkQskg=",
//           kty: "RSA",
//           n:
//             "xPh90jhIPbbmf2ippNo-o6iktc7BWwYIV4SrnN2OB2EGQX97wzPqvOjJ2gQoflLCVFTUM5Qt8YReTnUFq58MYeCclXT9qliWj9xqkfQi_tK_Go5dWGI4U41SX85uCbrUXHKOae1BiLRTNwoxxcRzSK9AvGJyCGQ2LlVfVjhwbUlCNN4qnmBr2nZkanNG5Y1EWoigfOEMBturP7ue_5OTyi1w4al3oKqC2er0Pv19L7uR0qFByaYL_yiiXjjcP9Jjl5h0hB6QAv26py3wNljth-OqFDSqeoMy8keRNmmqsArPkdSzmcjnynYgGOR8OQjxTb23VhNFyShS_A9LoHgVWQ",
//           use: "sig"
//         }
//       ]
//     };
//     const pem = jwkToPem(jwk);
//     jwt.verify(token, pem, {
//       algorithms: ["RS256"]
//     });
//     return true;
//   } catch (error) {
//     return false;
//   }
// };

const event = {
  requestContext: {
    routeKey: "logout",
    messageId: "M7dxfc5rywMCFlA=",
    eventType: "MESSAGE",
    extendedRequestId: "M7dxfFAEywMFarQ=",
    requestTime: "22/May/2020:10:29:55 +0000",
    messageDirection: "IN",
    stage: "dev",
    connectedAt: 1590143393053,
    requestTimeEpoch: 1590143395042,
    identity: {
      cognitoIdentityPoolId: null,
      cognitoIdentityId: null,
      principalOrgId: null,
      cognitoAuthenticationType: null,
      userArn: null,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36",
      accountId: null,
      caller: null,
      sourceIp: "157.36.127.70",
      accessKey: null,
      cognitoAuthenticationProvider: null,
      user: null
    },
    requestId: "M7dxfFAEywMFarQ=",
    domainName: "3prbzu5pil.execute-api.ap-southeast-2.amazonaws.com",
    connectionId: "M7dxLc5qywMCFlA=",
    apiId: "3prbzu5pil"
  },
  body:
    '{"action":"logout","sessionId":"0267ad15-a167-46c5-b893-bca63e6d4a4d","authorization":"eyJraWQiOiJUXC9uUzVQaWZNWkFCTEU5bW1NcGMwaWp3QXNBM2hsNlFjK3g1bFBvN05LQT0iLCJhbGciOiJSUzI1NiJ9.eyJjdXN0b206Y29uZmlybWVkRGF0ZSI6IjIwMjAtMDQtMDZUMTQ6MTU6NTVaIiwic3ViIjoiNmZiOTVmNmEtMGZiMS00NGJiLTkxYWMtMmYwYjk5Njk4NWU3IiwiYXVkIjoiMjVwbzUycTk5a2tqZGg1bjY5dGdzdnFhNW0iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImV2ZW50X2lkIjoiZTA2YzI0MjItYjJmZi00ODM3LTlhOGYtNGFkMGIzMTA3NjMzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1OTAxNzkyNjksImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aGVhc3QtMi5hbWF6b25hd3MuY29tXC9hcC1zb3V0aGVhc3QtMl95c21YczBxUnQiLCJjb2duaXRvOnVzZXJuYW1lIjoiNmZiOTVmNmEtMGZiMS00NGJiLTkxYWMtMmYwYjk5Njk4NWU3IiwiZXhwIjoxNTkwMTgyODY5LCJpYXQiOjE1OTAxNzkyNzAsImVtYWlsIjoiYW1pdC5zaGFoaUBibGF6ZWNsYW4uY29tIn0.NVng7UJoUspalhm1MGQXea0jD_8Si8GtJWx4Jm9y_UYLfrA27gEYG2qOqpvaa8iPBPwsIPNfS7jEOX6PHlnvdXzPBJf8mV6vzlZWNfCAGkvqoWRQMT4ywO4BCjlUfylYoC3Z2a7FK5WJh4ZKA6QIKpKO0CuFNzmHrD74MTQWA0IbFD5RYc3cQ2TjLN6FZq62M8PWDXETZWDO7yh9W46DhV7eioQpSBLBSJGsQz91bEEcm2vadOnKF-QrbSCkjRmSOb4bjrqjvs02gq-pUAoD8Ru5JfWzR99w331BR2Qk6KeZeXs_9M2cQhriPAPDOikjIi9Tfijr4QglqHZeKTKaiw","x-ehg-custom-authorization":"rM8PlAUNwVApVmEmsySfZZ/cQlU75dAWkEgW24ktf1YYmf5iuf4l3ui9FIU6AX+PuzXz7rAQao22ywRa59XgD3oHLAtlsq+uJQpPtYktslC2NaEzhROpGrWmoHCPIl6FJW96U9ES0559UpA4SuYWPko6gii0yCnEeXFxqRq6VByipRefJoFd70KnIT9oK+SK+dz69QrFtxu/S7Jn2X09jAZT/PTRj0dFIRZcXpEcVhQn/tCDHfwHV3WNwElLmaJplWOO2M9HIE0N5jqD5RgPHQ5gF3SQTGS1iVK0naHvXyAvTQzaJxk1zx8UaKhyvgIb8gEVcgtOb6eFZQqDCRDQbqo2lMo4H2yty3lMNdAlhY4L9yAj3i4S4YdG8iO1puZ9pbsDdArOA/vfADYxUmzV+MaJNn1cK1q9PMepimLRwUdXjbbxSfP7oKM1RtWvAIkko7nqmnHuVJgxXYi8MT3aHS0x7C13m3l6dmY+OYX5GOJeBCSbiacBd29A8b1yA3icCihJk2hQ1zMjeplKTCVIZQ27rV8RRBuClXsPr8sBitikTc8nHCw3euakSIXsMYKG6r6qCOT4YjSYZuP95vsc6QaJHdVinKXmgYlZpWYyRAiXwfNyK79Lh3Uh0/Y4cAecBoNQf6B3c6NDdmVk6RTVSIm2ppKSTb9Kzx7D2qiXL5elquUmsKT73/99oCoJrd39k0hitPlL8DRHbiTIST4ICXEps5qBMzMfybUkIObmP8s="}',
  isBase64Encoded: false
};
exports.handler(event);
