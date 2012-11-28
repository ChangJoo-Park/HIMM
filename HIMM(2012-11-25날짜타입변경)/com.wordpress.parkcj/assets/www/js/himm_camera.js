var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var photoid= window.localStorage.getItem('photoid');
var photoData= null;
var db;
var curlong;
var curlat;
var mapsrc;
var orgsrc;
var urlw; // 날씨 요청 url
var weather;
var today_date;
function onInit(){
	// 처음 일자
	var odate = new Date();
	var omonth = parseInt(odate.getMonth())+1;
	today_date = odate.getFullYear()+"년 "+omonth+"월 "+odate.getDate()+"일";
	$('span#datenow').html(today_date);
	// 폰갭 기능 이벤트 리스너
	document.addEventListener("deviceready",phoneReady,false);
	$('#diarydate').val(today_date);
}

function phoneReady() {
	// 카메라
	pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    db = window.openDatabase("HIMM_DB", "1.0", "Here Is My Memory DB", 200000); 	
    createDB();
    getGPS();
    getMap();
}
// 날씨 출력 시작
function printweather(){
  $.ajax({
	  url : urlw,
	  dataType : "jsonp",
	  jsonp : "callback",
	  success : function(parsed_json) {
	  	//아이콘 URL
	  	weather = parsed_json.current_observation.icon_url;
	  }
  	});
}

// 날씨 출력 중지
// 위치 받기
function getGPS(){
	navigator.geolocation.getCurrentPosition(onSuccessGPS, onErrorGPS);
}
function onSuccessGPS(position){
	curlat = position.coords.latitude;
	curlong = position.coords.longitude;
	urlw = "http://api.wunderground.com/api/c6cfb0c2f0291d80/conditions/lang:KR/q/";
	urlw +=curlat;
	urlw +=",";
	urlw +=curlong;
	urlw +=".json";
}
function onErrorGPS(err){
	 

}
//Capture Start
$('#newpic').live("click",function(event){
	event.preventDefault();
	navigator.camera.getPicture(onPhotoFileSuccess, onFail, {
		quality: 50,
		destinationType: Camera.DestinationType.FILE_URI });
});
$('#oldpic').live("click",function(){
	event.preventDefault();
    navigator.camera.getPicture(onPhotoURISuccess, onFail, 
        { quality: 50, 
          destinationType: destinationType.FILE_URI,
          sourceType: pictureSource.SAVEDPHOTOALBUM });
});

// Use Camera
function onPhotoFileSuccess(imageData) {
    var cameraImage = document.getElementById('cameraImage');
    //cameraImage.style.visibility = 'visible';
    // 2012-11-05 Unhide image Elements
    cameraImage.style.visibility = 'block';
    cameraImage.src = imageData;
    photoData = imageData;
    $('#cameraImage').show();
    printweather();
}
//Use Gallery
function onPhotoURISuccess(imageURI) {

	var cameraImage = document.getElementById('cameraImage');
    cameraImage.src = imageURI;
    photoData = imageURI;
    $('#cameraImage').show();
    printweather();
}

function onFail(message){
	
}
// Camera End

// DB Start

function createDB(){
    db.transaction(setupTable, dbErrorHandler, getEntries);    
}

//create table and insert some record
function setupTable(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS HIMM (id INTEGER PRIMARY KEY AUTOINCREMENT, Title TEXT NOT NULL, Content TEXT NOT NULL,Category INTEGER, FileURI TEXT,Longitude TEXT, Latitude TEXT,weather,updated)');
}

//function will be called when an error occurred
function dbErrorHandler(err) {
// 없앰
}

//function will be called when process succeed
function getEntries() {
    db.transaction(queryDB,dbErrorHandler);
}

// 기록 보기 부분 시작
function queryDB(tx){
	tx.executeSql('SELECT * FROM HIMM ORDER BY updated DESC, id DESC',[],renderList,dbErrorHandler);
}
var i=0;
function renderList(tx,result){
	$('#DiaryList').empty();
	if(result.rows.length == 0){
		$("#DiaryList").html("<h2>어떠한 기록도 없습니다.</h2><h3>" +
				"새 기록 버튼을 눌러 첫번째 기록을 남기세요!</h3></div>");
	}
	$.each(result.rows,function(index){
		var row = result.rows.item(index);
		var str = "<li class='ui-li-has-thumb' id='a'><a href='#diaryContent' >";
		str +="<img class='ui-li-thumb'";
		str +="src='"+row['FileURI']+"'/>";
		str +="<p>"+row['updated']+"</p>";
		str += "<h3>"+row['Title']+"</h3>";
		str += "<p class='ui-li-aside'>"+row['Category']+"</p></a></li>";
		$('#DiaryList').append(str);
	});
	$('#DiaryList').listview("refresh");
	getCount(result.rows.length);
}
function getCount(cnt){
	if(cnt == 0 ){
		$('#alldata').html('<h2>아무런 기록도 없습니다.</h2>');
	}else{
		$('#alldata').html('<strong>'+cnt+' 개의 기록이 있습니다.</strong>');
	}
}
//기록 보기 부분 끝

$("#submitDiary").live("click",function(e){
	e.preventDefault();
	var updated = $("#diarydate").val();
	var title = $('#diarytitle').val();
	var cont = $('#diarycont').val();
	var cate = $('#diarycate').val();
	var fileuri =  photoData;
	var long =  curlong;
	var lat =  curlat;
	db.transaction(function(tx){
		tx.executeSql('INSERT INTO HIMM(Title,Content,Category,FileURI,Longitude,Latitude,weather,updated ) VALUES(?,?,?,?,?,?,?,?)',[title ,cont ,cate ,fileuri ,long ,lat, weather,updated]);
		queryDB(tx);
	});
	$('#DiaryList').listview("refresh");
	$.mobile.changePage("HIMM_home.html");
});
$("#DiaryList li a").live('click',function(e){
	var imgstr = $(this).find('img').attr('src');
	var titlestr = $(this).find('h3').text();
	queryList(imgstr,titlestr);
});
//기록 보기 부분 시작
// 다이어리 세부 내용 시작
// 다이어리 파일명과 제목으로 구분
function queryList(imgstr,titlestr) {
	db.transaction(function(tx){
		var sql='SELECT * FROM HIMM WHERE '+"FileURI = "+  "'" + imgstr + "' and"+" Title = " + "'" + titlestr + "'";
		tx.executeSql(sql,[],renderContent,dbErrorHandler);
	});
}
// 다이어리 리스트를 눌렀을때 그리는 화면
function renderContent(tx,result){
	$('#diaryinside').empty();
	$.each(result.rows,function(index){
		var row = result.rows.item(index);
		var str = "<p><h1>"+row['Title']+"</h1>";
				str += "<h2 style='text-align:right;'>"+row['updated']+"</h2></p>";
		str +="<p><h4 style='text-align:right;'>이 날의 날씨<img src='"+row['weather']+"' style='float:right; width:40px; height:40px;' /></h4></p>";
		str +="<img src='"+row['FileURI']+"' "+"style='width:300px; height:300px; border:5px solid #5D6F5E; padding:7px; align:center;'/>";
		str +="<p style='border:1px groove white; padding:2px align:center;'><em>"+row['Content']+"</em></p>";
		$('#diaryinside').append(str);
		curlong = row['Longitude'];
		curlat = row['Latitude'];
		orgsrc = row['FileURI'];
	});
}
// 이미지 클릭 처리
$("#diaryinside img").live("click",function(e){
	var mapsrc = "http://maps.google.com/maps/api/staticmap?center="+curlat+","+curlong+"&zoom=18&size=300x300&markers=color:red|"+curlat+","+curlong+"&sensor=false";
	if($(this).attr("src")== mapsrc){
		$(this).attr("src",orgsrc);
	}else{
		$(this).attr("src",mapsrc);
	}
});
// DB End

// 맵 시작
	var markers = new Array();
function initializeMaps(markers) {
	var myOptions = {
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl: false
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
	var infowindow = new google.maps.InfoWindow(); 
	var marker, i;
	var bounds = new google.maps.LatLngBounds();

	for (i = 0; i < markers.length; i++) { 
		var pos = new google.maps.LatLng(markers[i][1], markers[i][2]);
		bounds.extend(pos);
		marker = new google.maps.Marker({
			position: pos,
			map: map
		});
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				var content_s = "<h4>"+markers[i][0]+"</h4><br/>"+"<img src='"+markers[i][4]+"'"+"style='width:150px;height:150px;'/><br/><h5>"+markers[i][3]+"</h5><br/>";
				infowindow.setContent(content_s);
				infowindow.open(map, marker);
			};
		})(marker, i));
	}
	map.fitBounds(bounds);
}
function getMap() {
    db.transaction(queryMap,dbErrorHandler);
}

function queryMap(tx){
	tx.executeSql('SELECT * FROM HIMM',[],renderMap,dbErrorHandler);
}
function renderMap(tx,result){
		$.each(result.rows,function(index){
			var row = result.rows.item(index);
			markers[index]= new Array();
			markers[index][0] = row['Title'];
			markers[index][1] = row['Latitude'];
			markers[index][2] = row['Longitude'];
			markers[index][3] = row['Content'];
			markers[index][4] = row['FileURI'];
			markers[index][5] = row['Category'];
	});
	initializeMaps(markers);
}
