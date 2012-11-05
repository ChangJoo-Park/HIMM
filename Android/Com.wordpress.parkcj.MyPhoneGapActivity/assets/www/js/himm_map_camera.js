/*
 *  2012-11-03 12:59 PM
 *  document.addEventListener("deviceready",onDeviceReady,false);
 *  - �� ������ �־�� ������ ����� ����� �� ����
 *  - ���� �� �������� �κ� �۾� ����.
 *  - ���� ���� �� writing ������ �۾� �ؾ���.
 * 2012-11-05
 * - ī�޶󿡼� ĸó�� �����Ͽ� ���� ������ ��
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
//�̰� ȣ���Ұ� ��ư����
//A button will call this function // ���� �۵���
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
    // ���� �ҷ����� ���� �� �ۼ� �������� �̵� 2012-11-04    
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
    // ���� �ҷ����� ���� �� �ۼ� �������� �̵� 2012-11-04
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
    // ���� �ҷ����� ���� �� �ۼ� �������� �̵� 2012-11-04    
    $.mobile.changePage("HIMM.html#pageWrite","flip",false,true);
    showpreviewImage();
}
*/

//Capture End
// a�±��� ȣ��
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