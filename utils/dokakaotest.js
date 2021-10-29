


var places = new kakao.maps.services.Places();
var callback = function(status, result, pagination) {
	if (status === kakao.maps.services.Status.OK) {
		alert("검색된 음식점의 갯수는 " +  result.places.length + "개 입니다.");
	}
};

places.categorySearch('FD6', callback, {
	location: new kakao.maps.LatLng(33.450701, 126.570667)
});