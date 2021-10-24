import { sign } from "jsonwebtoken";

const generateToken = (id, username, email) => {
  return sign(
    {
      user: {
        username: username,
        email: email,
        id: id,
      },
    },
    process.env.JWT_SECRET,
    { subject: id, expiresIn: "1d" }
  );
};

export default generateToken;
