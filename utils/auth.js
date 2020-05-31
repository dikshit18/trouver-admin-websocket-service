const jwt = require("jsonwebtoken");

exports.verifyTokenAsync = async token => {
  const secretKey = process.env.SIGNATURE_VALIDATION_KEY;
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) reject({ ...error, origin: "JWT" });
      //console.log.log(decoded);
      resolve(decoded);
    });
  });
};

exports.emailFromToken = idToken => {
  const decodedToken = jwt.decode(idToken);
  console.log("DecodedToken... ", decodedToken);
  return decodedToken.email;
};
