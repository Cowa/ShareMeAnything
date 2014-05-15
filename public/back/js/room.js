socket.emit('Server, please I want to share');

socket.on('People, here\'s the state of your room', function(state) {

  if (state == 0) {
    $('#stateOfRoom').text('You are alone...');
  } else if (state == 1) {
    $('#stateOfRoom').text('You are in communication !');
  }

  thankYouServer();
});

socket.on('People, this is you role', function(role) {

  if (role == 'sender') {
    $('#myRole').text('Sender');
  } else { // receiver
    $('#myRole').text('Receiver');
  }

  thankYouServer();
});
