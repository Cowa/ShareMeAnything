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
      document.querySelector('img').src = canvas.toDataURL('image/webp');
    }
  }

buttonPhoto.click(takePhoto);

var errorCallback = function() {
	console.log('Refused to access camera.');
};

if (navigator.getUserMedia) {
	navigator.getUserMedia(camConfig, function(stream) {
		video.src = window.URL.createObjectURL(stream);
		media = stream;
	}, errorCallback);
} else {
	video.src = 'sad';
}
