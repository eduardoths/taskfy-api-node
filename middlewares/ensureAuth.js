import { verify } from "jsonwebtoken";

export const ensureAuth = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      error: "invalid token",
    });
  }

  const [, token] = authToken.split(" ");

  try {
    const { user, sub } = verify(token, process.env.JWT_SECRET);
    const { username, email } = user;
    req.user_id = sub;
    req.username = username;
    req.email = email;
    return next;
  } catch (e) {
    return res.status(401).json({
      error: "expired token",
    });
  }
};
