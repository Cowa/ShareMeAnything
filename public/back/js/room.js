var myRole    = 'unknown',
    roomState = 'unknown';

socket.emit('Server, please I want to share');

socket.on('People, here\'s the state of your room', function(state) {

  if (state == 0) {
    $('#stateOfRoom').text('You are alone...');
  } else if (state == 1) {
    $('#stateOfRoom').text('You are in communication !');
  }

  roomState = state;

  thankYouServer();
});

socket.on('People, this is you role', function(role) {

  if (role == 'sender') {
    $('#myRole').text('You are the sender');
  } else { // receiver
    $('#myRole').text('You are the receiver');
  }

  myRole = role;

  thankYouServer();
});

function isSender() {
  return myRole == 'sender';
}

function shareByCamera() {

  if (isSender()) {
    initCamera();
  }
}

// Event listeners
$('#shareByCamera').click(shareByCamera);
