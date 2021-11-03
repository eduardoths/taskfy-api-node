import { sign } from "jsonwebtoken";

const generateToken = (id, username, email) => {
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

export default generateToken;
