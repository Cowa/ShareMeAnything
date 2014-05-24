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

socket.on('People, this photo was sent for you', function(photo) {

  viewSharedImage(photo);
  viewVoteBox();
  thankYouServer();
});

socket.on('People, this image was sent for you', function(image) {

  viewSharedImage(image);
  viewVoteBox();
  thankYouServer();
});

socket.on('People, your share was sent', function(share) {
  shareDone(share);
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
  $('#voteBox').hide();
}

function viewSharedImage(image) {
  $('#lastShare').append('<img src="' + image + '"/>');
}

function viewVoteBox() {
  $('#voteBox').show();
}

function isSender() {
  return myRole == 'sender';
}

function shareByCamera() {

  if (isSender()) {
    hideShareBoxes()
    $('#cameraShareBox').show();
    initCamera();
  }
}

function shareByImage() {

  if (isSender()) {
    hideShareBoxes()
    $('#imageShareBox').show();
  }
}

function shareByDraw() {

  if (isSender()) {
    hideShareBoxes()
    $('#drawShareBox').show();
  }
}

function shareByURL() {

  if (isSender()) {
    hideShareBoxes()
    $('#urlShareBox').show();
  }
}

function shareDone(share) {
  hideShareBoxes();
  $('#choiceOfShare').hide();
  viewSharedImage(share);
}

function voteFun() {
  console.log('Fun');
  socket.emit('Server, the share was fun !');
}

function voteBad() {
  socket.emit('Server, the share was bad...');
}

function hideShareBoxes(){
  $('#cameraShareBox').hide();
  $('#imageShareBox').hide();
  $('#drawShareBox').hide();
  $('#urlShareBox').hide();
}

/*********************
 ** EVENT LISTENERS **
 *********************/
$('#shareByCamera').click(shareByCamera);
$('#shareByImage').click(shareByImage);
$('#shareByDraw').click(shareByDraw);
$('#shareByURL').click(shareByURL);
$('#voteFun').click(voteFun);
$('#voteBad').click(voteBad);
