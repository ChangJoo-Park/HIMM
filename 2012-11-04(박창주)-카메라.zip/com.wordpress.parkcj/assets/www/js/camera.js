/*
 *  2012-11-03 12:59 PM
 *  document.addEventListener("deviceready",onDeviceReady,false);
 *  - �� ������ �־�� ������ ����� ����� �� ����
 *  - ���� �� �������� �κ� �۾� ����.
 *  - ���� ���� �� writing ������ �۾� �ؾ���.
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
    // ���� �ҷ����� ���� �� �ۼ� �������� �̵� 2012-11-04    
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
    // ���� �ҷ����� ���� �� �ۼ� �������� �̵� 2012-11-04
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
