var myRole    = 'unknown',
    roomState = 'unknown';

/**********************
 ** SOCKET LISTENERS **
 **********************/
socket.emit('Server, please I want to share');

socket.on('People, here\'s the state of your room', function(state) {

  viewState(state);
  roomState = state;

  thankYouServer();
});

socket.on('People, this is your role', function(role) {

  viewRole(role);
  myRole = role;

  thankYouServer();
});

socket.on('People, this camera photo was sent for you', function(photo) {

  viewSharedImage(photo);
  thankYouServer();
});

socket.on('People, this image was sent for you', function(image) {

  viewSharedImage(image);
  thankYouServer();
});

/***************
 ** FUNCTIONS **
 ***************/
function viewState(state) {

  if (state == 0) {
    $('#stateOfRoom').text('You are alone...');
    $('#waiting').show();
    $('#inTouch').hide();

  } else if (state == 1) {
    $('#stateOfRoom').text('You are in communication !');
    $('#waiting').hide();
    $('#inTouch').show();
  }
}

function viewRole(role) {

  if (role == 'sender') {
    $('#choiceOfShare').show();
    $('#myRole').text('You are the sender');
  } else {
    $('#choiceOfShare').hide();
    $('#myRole').text('You are the receiver');
  }
}

function viewSharedImage(image) {
  $('#lastShare').append('<img src="' + image + '"/>');
}

function isSender() {
  return myRole == 'sender';
}

function shareByCamera() {

  if (isSender()) {
    $('#cameraShareBox').show();
    initCamera();
  }
}

function shareByImage() {

  if (isSender()) {
    $('#imageShareBox').show();
  }
}

function shareByURL() {

  if (isSender()) {
    $('#urlShareBox').show();
  }
}

/*********************
 ** EVENT LISTENERS **
 *********************/
$('#shareByCamera').click(shareByCamera);
$('#shareByImage').click(shareByImage);
$('#shareByURL').click(shareByURL);
