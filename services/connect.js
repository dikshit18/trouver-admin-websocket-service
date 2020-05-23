exports.connect = callback => {
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify("connected")
  });
};
