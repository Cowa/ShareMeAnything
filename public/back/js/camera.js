navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

var media       = null,
	video       = document.querySelector('video'),
	canvas      = document.querySelector('canvas'),
	context     = canvas.getContext('2d'),
	buttonPhoto = $('#takePhoto'),
	buttonShare = $('#sharePhoto');

var camConfig = {
	video: {
		mandatory: {
			maxWidth: 320,
			maxHeight: 360
		}
	}
};

function takePhoto() {
	if (media) {
		context.drawImage(video, 0, 0);
		$('#takenPhoto').attr('src', canvas.toDataURL('image/webp'));
	}
}

function sharePhoto() {

	var photo = $('#takenPhoto').attr('src');

	if (photo != null) {
		socket.emit('Server, here\'s a photo from my camera', photo);
	} else {
		console.log('No photo taken.');
	}
}

var errorCallback = function() {
	console.log('Refused to access camera.');
};

function initCamera() {

	if (navigator.getUserMedia) {
		navigator.getUserMedia(camConfig, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			media = stream;
		}, errorCallback);
	} else {
		video.src = 'none';
	}
}

// Event listeners
buttonPhoto.click(takePhoto);
buttonShare.click(sharePhoto);
