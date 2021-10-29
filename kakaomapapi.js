require("dotenv").config();
const api_key = process.env.kakaoApiKey;
const request = require("request");

const heaer = 'KakaoAK '+ api_key;
request.get({
    headers : {"Authorization" : heaer},
    url : 'https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&page=1&x=127.947727443701&y=37.337061376149&radius=1000'
}, function (error, response, body) {
    console.log("에러는 ",error,"바디",body)
})

const data = {
  documents: [
    {
      address_name: "제주특별자치도 제주시 영평동 2169-3",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 한식 > 육류,고기 > 닭요리",
      distance: "447",
      id: "380906782",
      phone: "0507-1368-9245",
      place_name: "부가네얼큰이 첨단점",
      place_url: "http://place.map.kakao.com/380906782",
      road_address_name: "제주특별자치도 제주시 첨단로 199",
      x: "126.571962902672",
      y: "33.4545839507193",
    },
    {
      address_name: "제주특별자치도 제주시 영평동 2169-2",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 한식",
      distance: "463",
      id: "769942895",
      phone: "064-726-6623",
      place_name: "영평식당",
      place_url: "http://place.map.kakao.com/769942895",
      road_address_name: "제주특별자치도 제주시 첨단로3길 10",
      x: "126.572470555321",
      y: "33.4545893987906",
    },
    {
      address_name: "제주특별자치도 제주시 영평동 2169-12",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 간식 > 제과,베이커리 > 파리바게뜨",
      distance: "267",
      id: "1302473345",
      phone: "064-723-2240",
      place_name: "파리바게뜨 제주첨단점",
      place_url: "http://place.map.kakao.com/1302473345",
      road_address_name: "제주특별자치도 제주시 첨단로 217",
      x: "126.57167402305184",
      y: "33.45296007096095",
    },
    {
      address_name: "제주특별자치도 제주시 영평동 2169-3",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 한식 > 육류,고기",
      distance: "445",
      id: "1862783318",
      phone: "064-727-8872",
      place_name: "탐나궁",
      place_url: "http://place.map.kakao.com/1862783318",
      road_address_name: "제주특별자치도 제주시 첨단로 199",
      x: "126.571958706692",
      y: "33.4545622978076",
    },
    {
      address_name: "제주특별자치도 제주시 영평동 2169-2",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 뷔페 > 한식뷔페",
      distance: "458",
      id: "118805148",
      phone: "",
      place_name: "뼈감탕",
      place_url: "http://place.map.kakao.com/118805148",
      road_address_name: "제주특별자치도 제주시 첨단로3길 10",
      x: "126.57244061668769",
      y: "33.45455314134939",
    },
    {
      address_name: "제주특별자치도 제주시 아라일동 7-24",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 중식 > 중화요리",
      distance: "618",
      id: "695892766",
      phone: "",
      place_name: "황궁만리장성",
      place_url: "http://place.map.kakao.com/695892766",
      road_address_name: "제주특별자치도 제주시 산천단남2길 77",
      x: "126.564100907593",
      y: "33.4497384037477",
    },
    {
      address_name: "제주특별자치도 제주시 영평동 2169-18",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점",
      distance: "163",
      id: "2109851990",
      phone: "",
      place_name: "꼬신김밥 첨단점",
      place_url: "http://place.map.kakao.com/2109851990",
      road_address_name: "제주특별자치도 제주시 첨단로5길 1",
      x: "126.571709474685",
      y: "33.4518746653568",
    },
    {
      address_name: "제주특별자치도 제주시 월평동 747",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 치킨 > 멕시카나치킨",
      distance: "547",
      id: "871920100",
      phone: "0507-964-1409",
      place_name: "멕시카나치킨 첨단점",
      place_url: "http://place.map.kakao.com/871920100",
      road_address_name: "제주특별자치도 제주시 첨단로동길 106",
      x: "126.57647863723106",
      y: "33.45140418216076",
    },
    {
      address_name: "제주특별자치도 제주시 영평동 2169-18",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 간식 > 제과,베이커리",
      distance: "163",
      id: "135946767",
      phone: "",
      place_name: "으뜸아이스크림할인점 첨단단지",
      place_url: "http://place.map.kakao.com/135946767",
      road_address_name: "제주특별자치도 제주시 첨단로5길 1",
      x: "126.571709474685",
      y: "33.4518746653568",
    },
    {
      address_name: "제주특별자치도 제주시 영평동 2169-2",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 한식 > 감자탕",
      distance: "458",
      id: "841139657",
      phone: "",
      place_name: "일구칠사뼈감탕",
      place_url: "http://place.map.kakao.com/841139657",
      road_address_name: "제주특별자치도 제주시 첨단로3길 10",
      x: "126.572438447842",
      y: "33.4545567402748",
    },
    {
      address_name: "제주특별자치도 제주시 아라일동 산 1",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점 > 중식 > 중화요리",
      distance: "822",
      id: "17032408",
      phone: "064-702-7090",
      place_name: "글로벌 차이니즈레스토랑",
      place_url: "http://place.map.kakao.com/17032408",
      road_address_name: "",
      x: "126.567399989361",
      y: "33.4438029907087",
    },
    {
      address_name: "제주특별자치도 제주시 아라일동 362-32",
      category_group_code: "FD6",
      category_group_name: "음식점",
      category_name: "음식점",
      distance: "928",
      id: "15432469",
      phone: "064-754-7301",
      place_name: "건영",
      place_url: "http://place.map.kakao.com/15432469",
      road_address_name: "",
      x: "126.561314633516",
      y: "33.4477306287679",
    },
  ],
  meta: {
    is_end: true,
    pageable_count: 12,
    same_name: null,
    total_count: 12,
  },
};


// console.log(data.documents)
for(a of data.documents){
    console.log(a.id);
}

