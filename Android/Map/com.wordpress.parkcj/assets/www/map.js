$( "#map-page" ).live( "pageinit", function() {
	alert('dd');
// ��븳誘쇨뎅, �쒖슱�쒖껌 : // �꾨룄: 37.566535 // 寃쎈룄: 126.977969
var defaultLatLng = new google.maps.LatLng(37.566535, 126.977969); // �쒖슱�쒖껌
if ( navigator.geolocation ) {
function success(pos) {
drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
}
function fail(error) {
console.log(error);
drawMap(defaultLatLng);
}
navigator.geolocation.getCurrentPosition(success, fail, {maximumAge: 500000, enableHighAccuracy:true, timeout: 6000});
} else {
drawMap(defaultLatLng); // No geolocation support, show default map
}
function drawMap(latlng) {
 var myOptions = {
 zoom: 16, // 0-17
 center: latlng,
 mapTypeId: google.maps.MapTypeId.ROADMAP
 };
 var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
 // Add an overlay to the map of current lat/lng
 var marker = new google.maps.Marker({
 position: latlng,
 map: map,
 title: "Greetings!"
 });
 }
 });
