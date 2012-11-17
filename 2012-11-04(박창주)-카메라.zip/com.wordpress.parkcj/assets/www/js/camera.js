/*
 *  2012-11-03 12:59 PM
 *  document.addEventListener("deviceready",onDeviceReady,false);
 *  - 이 라인이 있어야 폰갭의 기능을 사용할 수 있음
 *  - 현재 새 사진으로 부분 작업 가능.
 *  - 사진 찍은 후 writing 페이지 작업 해야함.
 * 
 * */
var pictureSource;   // picture source
var destinationType; // sets the format of returned value 

// Wait for PhoneGap to connect with the device
//
document.addEventListener("deviceready",onDeviceReady,false);

// PhoneGap is ready to be used!
//
function onDeviceReady() {
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
}

// api-camera
function onPhotoDataSuccess(imageData) {
    console.log("* * * onPhotoDataSuccess");
    var cameraImage = document.getElementById('cameraImage');
    cameraImage.style.visibility = 'visible';
    cameraImage.src = "data:image/jpeg;base64," + imageData;
    // 파일 불러오기 성공 후 작성 페이지로 이동 2012-11-04    
    $.mobile.changePage("HIMM.html#pageWrite","flip",false,true);
    showpreviewImage();
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
}

function take_pic() {
    navigator.camera.getPicture(onPhotoDataSuccess, function(ex) {
        alert("Camera Error!");
    }, {targetWidth : 400, targetHeight : 300 ,
    	quality : 50, destinationType: destinationType.DATA_URL
    	});
}

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
