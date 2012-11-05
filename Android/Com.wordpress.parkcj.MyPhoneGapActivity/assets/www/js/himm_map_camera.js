/*
 *  2012-11-03 12:59 PM
 *  document.addEventListener("deviceready",onDeviceReady,false);
 *  - 이 라인이 있어야 폰갭의 기능을 사용할 수 있음
 *  - 현재 새 사진으로 부분 작업 가능.
 *  - 사진 찍은 후 writing 페이지 작업 해야함.
 * 2012-11-05
 * - 카메라에서 캡처로 변경하여 파일 저장할 것
 * */
var pictureSource;   // picture source
var destinationType; // sets the format of returned value 
var photoid= window.localStorage.getItem('photoid');
var photoData= null;
// Wait for PhoneGap to connect with the device
//
function onInit(){
	var odate = new Date();
	var omonth = parseInt(odate.getMonth())+1;
	var today_date = odate.getFullYear()+" / "+omonth+" / "+odate.getDate();
	$('span#datenow').html(today_date);
}

// PhoneGap is ready to be used!
//
document.addEventListener("deviceready",onDeviceReady,false);

function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}
//Capture Start
//이거 호출할것 버튼으로
//A button will call this function // 정상 작동함
function captureImage(){
	navigator.device.capture.captureImage(captureSuccess, captureError,{limit: 2});
}
function capturePhotoWithFile(source){
	navigator.camera.getPicture(onPhotoFileSuccess, onFail,{quality:50, destinationType: Camera.DestinationType.File_URI, sourceType: source });
}
//Called when capture operation is finished

function onPhotoFileSuccess(imageData) {
    var cameraImage = document.getElementById('cameraImage');
    //cameraImage.style.visibility = 'visible';
    // 2012-11-05 Unhide image Elements
    cameraImage.style.visibility = 'block';
    cameraImage.src = imageData;
    alert(imageData);
    photoData = imageData;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    // 파일 불러오기 성공 후 작성 페이지로 이동 2012-11-04    
    $.mobile.changePage("HIMM.html#pageWrite","flip",false,true);
    showpreviewImage();
    alert(cameraImage.src);
}
function onPhotoURISuccess(imageURI) {
    console.log("* * * onPhotoURISuccess");
    // Uncomment to view the image file URI 
    // console.log(imageURI);
    var cameraImage = document.getElementById('cameraImage');
    cameraImage.style.visibility = 'visible';
    cameraImage.src = imageURI;
    // 파일 불러오기 성공 후 작성 페이지로 이동 2012-11-04
    $.mobile.changePage("HIMM.html#pageWrite","flip",false,true);
    showpreviewImage();
    alert(cameraImage.src);
}

function onFail(message){
	alert('Failed because : '+message);
}

/*
function captureSucess(mediaFiles){
	var i , len;
	for(i=0, len=MediaFiles.length; i<len;i+=1){
		uploadFile(mediaFiles[i]);
	}
}
//Called f someting bad happens.
function captureError(error){
	var msg = 'An error occurred during capture: '+error.code;
	navigator.notification.alert(msg,null,"Error!");
}

// api-camera
function onPhotoDataSuccess(imageData) {
    console.log("* * * onPhotoDataSuccess");
    var cameraImage = document.getElementById('cameraImage');
    
    //cameraImage.style.visibility = 'visible';
    // 2012-11-05 Unhide image Elements
    cameraImage.style.visibility = 'block';
    cameraImage.src = "data:image/jpeg;base64," + imageData;
    // 파일 불러오기 성공 후 작성 페이지로 이동 2012-11-04    
    $.mobile.changePage("HIMM.html#pageWrite","flip",false,true);
    showpreviewImage();
}
*/

//Capture End
// a태그의 호출
/*
function take_pic() {
    navigator.camera.getPicture(onPhotoDataSuccess, function(ex) {
        alert("Camera Error!");
    }, {targetWidth : 400, targetHeight : 300 ,
    	quality : 50, destinationType: destinationType.DATA_URL
    	});
}
*/
function album_pic() { 
    navigator.camera.getPicture(onPhotoURISuccess, function(ex) {
            alert("Camera Error!"); }, 
            { quality: 50, 
        destinationType: destinationType.FILE_URI,
        // Android Quirk: Camera.PictureSourceType.PHOTOLIBRARY and 
        // Camera.PictureSourceType.SAVEDPHOTOALBUM display the same photo album.
        sourceType: pictureSource.SAVEDPHOTOALBUM });
}
function showpreviewImage(){
	$('div#previewImage').show();
}
// Camera End


// File Write
function gotFS(fileSystem){
	fileSystem.root.getFile(photoid+".jpg",null,gotFileEntry,fail);
}

function gotFileEntry(fileEntry){
	fileEntry.createWriter(gotFileWriter, fail);
}

function gotFileWriter(writer){
	writer.onwrite = function(evt){
		alert("write success");
	};
	writer.write(photoData);
	
	writer.truncate(11);
	writer.seek(4);
	writer.write("different text");
}
function fail(error){
	console.log(error.code);
}