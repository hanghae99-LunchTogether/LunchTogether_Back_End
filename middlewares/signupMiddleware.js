import signUpSchema from "../validations/signup.js";
import { logger } from "../logger/logger.js";

export const validateSignUp = async (req, res, next) => {
  const { nickname, email, password, confirmPassword } = req.body;

  try {
    const value = await signUpSchema.validateAsync({
      nickname,
      email,
      password,
      confirmPassword,
    });
    console.log(value);
    next();
  } catch (error) {
    console.log(error);
    logger.error(error);
    return res.status(400).send({ message: "양식을 확인하세요." });
  }
};
