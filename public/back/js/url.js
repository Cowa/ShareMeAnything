function shareUrl() {

	url = $('#urlToShare').val();
	socket.emit('Server, I shared something from an URL', url);

	$('#urlToShare').val('');
}

function badUrl() {
	$('#urlToShare').attr('placeholder', 'Invalid URL');
}

function getYoutubeId(url) {

	var id = '';
	url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[2] !== undefined) {
		id = url[2].split(/[^0-9a-z_-]/i);
		id = id[0];
	} else {
		id = url;
	}
	return id;
}

// Get Vimeo video Id
function getVimeoId(url) {

	var match = url.match(/http:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/);
	return match[2];
}

/*********************
 ** EVENT LISTENERS **
 *********************/
$('#shareUrl').click(shareUrl);
