const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "Lunch Meet",
    description: "Description",
  },
  host: "lebania.shop", //배포 하려고 하는 host에 맞춰줘야 동작함
  basePath: "/",
  schemes: ["http", "https"],
  tags: [
    {
      name: "Login",
      description: "로그인",
    },
    {
      name: "signup",
      description: "회원가입",
    },
    {
      name: "lunchPost",
      description: "게시판",
    },
    {
      name: "Comment",
      description: "댓글",
    },
    {
      name: "Spoon",
      description: "유저평가",
    },
    {
      name: "Applicant",
      description: "신청자",
    },
    {
      name: "myProfile",
      description: "유저정보",
    },
    {
      name: "bookmark",
      description: "북마크",
    },
    {
      name: "offer",
      description: "다른 유저에게 점약 제안",
    },
  ],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];
// const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
//swaggerAutogen으로 outputfile 파일을 app.js 루트로 api 들을 생성한다.
//이때 명령어는 터미널에서 node swagger.js
