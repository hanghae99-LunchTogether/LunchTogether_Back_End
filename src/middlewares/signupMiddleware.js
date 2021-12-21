const signUpSchema = require("../validations/signup.js");
const { logger } = require("../config/logger");

module.exports = async (req, res, next) => {
  const { nickname, email, password } = req.body;
  console.log(nickname, email, password);

  try {
    // joi스키마 미들웨어 방식
    const value = await signUpSchema.validateAsync({
      nickname,
      email,
      password,
    });
    console.log(value);
    next();
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(400).send({ message: "양식을 확인하세요." });
  }
};
