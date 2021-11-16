import { sign, verify } from "jsonwebtoken";

const jwt = () => {
  const signToken = (id, username, email) => {
    return sign(
      {
        user: {
          username: username,
          email: email,
        },
      },
      process.env.JWT_SECRET,
      { subject: id, expiresIn: "8h" }
    );
  };

  const verifyToken = (token) => {
    const { user, sub } = verify(token, process.env.JWT_SECRET);
    const { username, email } = user;
    return {
      id: sub,
      username: username,
      email: email,
    };
  };
  return {
    signToken,
    verifyToken,
  };
};

export default jwt;
