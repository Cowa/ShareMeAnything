var politeMode = true;

// Be polite, being a server is a real job
function thankYouServer() {
	if (politeMode) {
		socket.emit('Server, thank you !');
	}
}
