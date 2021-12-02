# FORK(포크)
매일 먹는 점심, 매번 같은 사람과 지겹지 않나요?

새로운 사람들과 먹고 싶은 음식, 하고 싶은 이야기 나누며 함께하면 어떨까요?

**FORK(포크)는**

- 내 위치에 기반해서
- 주변에 있는 사람들 중 함께하고 싶은 사람들과
- 점심약속을 만들고, 신청할 수 있는

**위치기반 점심약속 커뮤니티 웹서비스입니다.**


![포크](https://user-images.githubusercontent.com/89914920/144397596-916fb4e0-afa5-410e-92a7-6035ac258bc4.png)

## 🖥 웹 사이트
https://lunchfork.co.kr  
## 👨‍🎨 FORK 소개

**내 위치 중심의   
주변에 있는 사람들 중 함께하고 싶은 사람들과    
점심약속을 만들고, 신청할 수 있는   
위치기반 점심약속 커뮤니티 웹서비스**
   
## 📌 개요
* 이름: FORK 포크   
* 기간: 2021.10.23 ~ 2021.12.02   
* 팀원   
  * Front-end(React): 김덕현,박새봄,이민국   
  * Back-end(Node.js): 김도형,이보훈,정창우   
  * Designer(UI/UX): 김주성   
## 🛠Architecture   
![아키텍쳐](https://user-images.githubusercontent.com/89914920/144398054-1c23497f-7e77-46aa-83ee-a4897c487195.png)

* REST API: AWS EC2(Ubuntu 18.04 LTS)   
* Framework: Express   
* ORM : Sequelize  
* Database: Amazon RDS (MySQL)   
* Image Storage : AWS S3
## 📚 주요 라이브러리
axios, class-validator, passport, multer, dotenv, helmet, cors, joi, socket.io, redis, swagger

## ✨ 주요 기능
1. 로그인
* 구글, 카카오 계정 소셜 로그인 방식을 사용합니다.
* 리프레시 토큰과 엑세스 토큰을 사용합니다.
2. 부트캠프 리뷰
* 11개의 부트캠프 정보와 리뷰를 작성하고 조회할 수 있습니다.
* 원하는 부트캠프를 찜할 수 있습니다.
* 부트캠프에 리뷰를 작성하고 별점을 줄 수 있습니다.
3. 자유게시판
* 자유로운 주제로 사진과 함께 작성 할 수 있습니다
* 인기순 정렬시 (조회수 * 좋아요) 값을 기준으로 정렬해서 보여줍니다.
* 사진을 업로드시 자동으로 압축됩니다.
* 글을 북마크할 수 있습니다.
* 댓글 및 좋아요 기능으로 소통할 수 있습니다.
4. 질문게시판
* 원하는 질문 게시글에 답변을 남길 수 있습니다.
* 마음에 드는 답변과 질문에 좋아요를 남길 수 있습니다.
* 답변은 한 번 작성시 수정 또는 삭제할 수 없습니다.
5. 마이페이지
* 자신의 닉네임과 프로필 사진을 수정할 수 있습니다.
* 북마크한 질문 , 자유 게시판 글과 부트캠프를 확인할 수 있습니다.
* 자신이 작성한 글 목록을 확인할 수 있습니다.   
## 🔨 주요 개선 사항   
* 코드를 한 사람이 쓴 것처럼 일관된 형태로 고쳤습니다.   
* sharp 라이브러리를 사용하여 사진을 압축하여 원본과 함께 저장하였습니다. 사용자에게 더 빠르게 페이지를 보여줄 수 있었습니다.   
* 악성 유저의 글 도배를 방지하는 간단한 알고리즘을 적용했고 개선하는 중입니다.   
* Amazon RDS와 S3 이미지 저장소를 서버에서 분리해내 서버 부하를 줄였습니다.   
## 👨‍🎨 FORK QA 시트
https://docs.google.com/spreadsheets/d/1swGMGL0hEIzGJwoVXUWcogfXgQszD_1iiOhAsA6Lp6s/edit#gid=0 
## 🎨 프로젝트 초기 기획 노션
https://juniper-airbus-ec4.notion.site/3-FORK-42f7f98d28924584b813293e16706382
## 📌 Front-End(React) 깃허브
https://github.com/hanghae99-LunchTogether/LunchTogether_Front_End






