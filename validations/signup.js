const Joi = require("joi");

const usernameRegExp = /^[0-9a-zㄱ-ㅎㅏ-ㅣ가-힣]$/gi;
const passwordRegExp =
  /^[0-9a-z!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\"\'\,\.\/\`\₩]$/gi;

const signUpSchema = Joi.object({
  nickname: Joi.string().min(3).max(8).regex(usernameRegExp).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required(),
  password: Joi.string().min(8).max(16).regex(passwordRegExp).required(),
});

export default signUpSchema;
