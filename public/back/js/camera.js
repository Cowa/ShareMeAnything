navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

var media       = null,
    video       = document.querySelector('video'),
    canvas      = document.querySelector('canvas'),
    photoHolder = canvas.getContext('2d');

var camConfig = {
	'video': true
	};

function takePhoto() {
	if (media) {
		photoHolder.drawImage(video, 0, 0);
	}
}

function sharePhoto() {
	var photo = canvas.toDataURL('image/webp');
	socket.emit('Server, here\'s a photo from my camera', photo);
}

function initCamera() {

	if (navigator.getUserMedia) {
		navigator.getUserMedia(camConfig, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			media = stream;
		}, function() {
			console.log('Refused to access camera.');
		});
	} else {
		video.src = 'none';
	}
}

/*********************
 ** EVENT LISTENERS **
 *********************/
$('#takePhoto').click(takePhoto);
$('#sharePhoto').click(sharePhoto);
