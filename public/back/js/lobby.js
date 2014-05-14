socket.emit('Server, please add me to lobby');

socket.on('People, I updated the number of people in rooms', function(number) {

  socket.emit('Server, thank you !');
  $('#numberOfPeopleInRooms').text(number);
});
