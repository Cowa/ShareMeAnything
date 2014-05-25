socket.emit('Server, please add me to lobby');

socket.on('People, I updated the number of people in rooms', function(number) {

  $('#numberOfPeopleInRooms').text(number);
  thankYouServer();
});
