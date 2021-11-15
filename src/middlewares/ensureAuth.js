import { verify } from "jsonwebtoken";

export const ensureAuth = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({
      error: "token.invalid",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    const { user, sub } = verify(token, process.env.JWT_SECRET);
    const { username, email } = user;
    req.body.user = {
      id: sub,
      username: username,
      email: email,
    };
    next();
  } catch (e) {
    return res.status(401).json({
      error: "token.expired",
    });
  }
};
