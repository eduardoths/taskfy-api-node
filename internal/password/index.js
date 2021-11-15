const bcrypt = require("bcrypt");
const saltRounds = 12;

const bcryptPassword = () => {
  const hash = async (password) => {
    return await bcrypt.hash(password, saltRounds);
  };

  const compare = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };

  return {
    hash,
    compare,
  };
};

export default bcryptPassword;
