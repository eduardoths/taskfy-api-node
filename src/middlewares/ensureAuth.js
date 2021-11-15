import jwt from "../../pkg/jwt";

export const ensureAuth = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({
      error: "token.invalid",
    });
  }

  const [, token] = authToken.split(" ");

  const jwtHelper = jwt();

  try {
    let user = jwtHelper.verifyToken(token);
    res.locals.user = user;
    next();
  } catch (e) {
    console.error(e);
    return res.status(401).json({
      error: "token.expired",
    });
  }
};
