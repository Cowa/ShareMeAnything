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

socket.on('People, this image was sent for you', function(image) {

  viewSharedImage(image);
  viewVoteBox();

  thankYouServer();
});

socket.on('People, this video was sent for you', function(video, type) {

  shareDone(video, type);
  viewVoteBox();

  thankYouServer();
});

socket.on('People, your share was sent', function(share, type) {
  shareDone(share, type);
  thankYouServer();
});

socket.on('People, your share was fun !', function() {
  putLastShareInHistory();
  thankYouServer();
});

socket.on('People, sorry but your share seems invalid', function() {
  badUrl();
});

socket.on('People, sorry but this is the end...', function(who) {
  viewTheEnd(who);
  putLastShareInHistory();
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

function viewSharedYoutube(video) {
  var html = '<iframe id="ytplayer" type="text/html" width="640" height="360" src="https://www.youtube.com/embed/'
              + getYoutubeId(video) +
              '" frameborder="0" allowfullscreen>';

  $('#lastShare').append(html);
}

function viewSharedVideo(video) {
  var html = '<iframe src="//player.vimeo.com/video/'
              + getVimeoId(video) +
              '" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

  $('#lastShare').append(html);
}

function viewVoteBox() {
  $('#voteBox').show();
}

function viewTheEnd(who) {
  hideShareBoxes();
  $('#endOfCommunication').show();
  $('#voteBox').hide();
}

function putLastShareInHistory() {
  $("#lastShare").children().first().appendTo("#currentHistory");
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
    initDraw();
  }
}

function shareByURL() {

  if (isSender()) {
    hideShareBoxes()
    $('#urlShareBox').show();
  }
}

function shareDone(share, type) {
  hideShareBoxes();
  $('#choiceOfShare').hide();

  if (type == 'image') {
    viewSharedImage(share);
  } else if (type == 'youtube') {
    viewSharedYoutube(share);
  } else if (type == 'vimeo') {
    viewSharedVideo(share);
  }
}

function voteFun() {
  putLastShareInHistory()
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
