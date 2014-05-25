/***************
 ** FUNCTIONS **
 ***************/
function openFileSelect() {
  $('#imageToShare').click();
}

function shareImage(e) {

  var data = e.originalEvent.target.files[0];
  var reader = new FileReader();

  reader.onload = function(evt) {
    var image = evt.target.result;
    socket.emit('Server, here\'s an image I uploaded', image);
  };

  reader.readAsDataURL(data);
}

/*********************
 ** EVENT LISTENERS **
 *********************/
$('#shareImage').click(openFileSelect);
$('#imageToShare').change(function(e) {
  shareImage(e);
});
