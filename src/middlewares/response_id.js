const uuid = require("uuid");

export const responseId = (req, res, next) => {
  let reqUUID = uuid.v4();
  res.locals.responseId = reqUUID;
  req.id = reqUUID;
  next();
};
