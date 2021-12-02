# FORK(포크)

**매일 먹는 점심, 매번 같은 사람과 지겹지 않나요?**

**새로운 사람들과 먹고 싶은 음식, 하고 싶은 이야기 나누며 함께하면 어떨까요?**

![포크](https://user-images.githubusercontent.com/89914920/144397596-916fb4e0-afa5-410e-92a7-6035ac258bc4.png)

## 🖥 웹 사이트
https://lunchfork.co.kr  
## 👨‍🎨 FORK 소개

**FORK(포크)는**

- 내 위치에 기반해서
- 주변에 있는 사람들 중 함께하고 싶은 사람들과
- 점심약속을 만들고, 신청할 수 있는

**위치기반 점심약속 커뮤니티 웹서비스입니다.**
   
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
<img src="https://img.shields.io/badge/Axios-0.24.0-764ABC?style=flat-square&logo=Axios&logoColor=white"/> <img src="https://img.shields.io/badge/Passport-0.5.0-34E27A?style=flat-square&logo=Passport&logoColor=white"/> <img src="https://img.shields.io/badge/multer-1.4.3-F38658?style=flat-square&logo=multer&logoColor=white"/>
<img src="https://img.shields.io/badge/dotenv-10.0.0-E5CE3D?style=flat-square&logo=dotenv&logoColor=white"/>
<img src="https://img.shields.io/badge/Cors-2.8.5-F7D18B?style=flat-square&logo=Cors&logoColor=white"/>   
<img src="https://img.shields.io/badge/Joi-17.4.2-E52C6D?style=flat-square&logo=Joi&logoColor=white"/>
<img src="https://img.shields.io/badge/Socket.io-4.4.0-010101?style=flat-square&logo=Socket.io&logoColor=white"/>
<img src="https://img.shields.io/badge/Redis-4.0.0-DC382D?style=flat-square&logo=Redis&logoColor=white"/>
<img src="https://img.shields.io/badge/Swagger-2.12.2-85EA2D?style=flat-square&logo=Swagger&logoColor=white"/>

## ✨ 주요 기능
1. 로그인
* 로컬 로그인, 카카오 계정 소셜 로그인 방식을 사용합니다.

2. 점심약속 등록
* 점심약속을 등록할 수 있습니다.
* 카카오맵을 이용해 약속장소를 선택할 수 있습니다.
* 댓글 기능을 통해 소통할 수 있습니다.
* 스케줄러를 이용하여 해당 약속시간이 지나면 약속이 자동 완료처리가 됩니다.

3. 메인 페이지
* 등록된 게시글을 모두 볼 수 있습니다.
* 글을 북마크 할 수 있습니다.

4. 멤버 페이지
* 가입한 유저를 모두 볼 수 있습니다.
* 유저에게 점심약속 개인신청을 할 수 있습니다.

5. 알림 탭
* 점심 약속 신청, 거절에 대한 알림이 옵니다.
* 소켓을 이용, 캐시서버를 사용하여 접속된 사용자를 파악합니다.

6. 즐겨찾기 페이지
* 북마크 한 게시글을 확인할 수 있습니다.

7. 마이페이지
* 자신의 닉네임과 프로필 사진을 수정할 수 있습니다.
* 예정된 약속과 제안받은 약속, 완료된 약속, 리뷰를 확인할 수 있습니다.
* 자신이 작성한 글을 확인할 수 있습니다.
* 점심 약속을 함께한 멤버의 리뷰를 작성하고 별점을 줄 수 있습니다.

## 🔨 주요 개선 사항   
1. 노드서버가 꺼지면 스케줄러도 같이 꺼진다
* 노드 서버가 꺼졋을때 스케줄러를 복구할수 있는 방법을 찾아야된다.
* 첫번째 스케줄러를 레디스 서버에 저장하여 스케줄러를 실행한다..
* 노드 서버에서 스케줄러를 사용하는것이 아닌 서버자체의 리눅스 스케줄러를 사용한다. 문제점: 리눅스 서버도 꺼진다면?
* 스케줄러를 해당 약속시간에 돌리는 것이 아닌 매 시간마다 약속시간을 확인하여 완료처리한다
2. 스케일 아웃
* 스케일 아웃에 관하여 잘되지 않으나 스케일 아웃을 대비하여 DB서버와 Redis캐시 서버를 따로두어 
* 스케일 아웃을 대비를 했으나. 테스트를 해보지 않음.
3. 위치기반
* 위치기반으로 데이터를 뿌려주고 있으나 (맴버 리스트의 경우)
* 유저가 위치정보를 등록해야지 위치기반으로 검색하고 있음
* 위치 정보를 등록안한 상태면 강남역을 기준으로 데이터를 뿌려주고있음
* 현재 사용자의 위치를 받아올 수 있도록 해야된다.
## 👨‍🎨 FORK QA 시트
https://docs.google.com/spreadsheets/d/1swGMGL0hEIzGJwoVXUWcogfXgQszD_1iiOhAsA6Lp6s/edit#gid=0 
## 🎨 프로젝트 초기 기획 노션
https://juniper-airbus-ec4.notion.site/3-FORK-42f7f98d28924584b813293e16706382
## 📌 Front-End(React) 깃허브
https://github.com/hanghae99-LunchTogether/LunchTogether_Front_End






