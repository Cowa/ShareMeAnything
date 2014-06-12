var clickX    = [],
    clickY    = [],
    clickDrag = [],
    drawing,
    whitePaper;

function initDraw() {
	whitePaper = $("#drawToShare")[0].getContext('2d');
}

function partialClearDraw() {
	whitePaper.clearRect(0, 0, whitePaper.canvas.width, whitePaper.canvas.height);
}

function fullClearDraw() {

	partialClearDraw()
	clickX    = [];
	clickY    = [];
	clickDrag = [];
}

function addClick(x, y, dragging) {

	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
}

function redraw() {

	partialClearDraw()

	whitePaper.strokeStyle = "#5EAA63";
	whitePaper.lineJoin = "round";
	whitePaper.lineWidth = 5;
			
	for (var i=0; i < clickX.length; i++) {

		whitePaper.beginPath();

		if (clickDrag[i] && i) {
			whitePaper.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			whitePaper.moveTo(clickX[i]-1, clickY[i]);
		}
		whitePaper.lineTo(clickX[i], clickY[i]);
		whitePaper.closePath();
		whitePaper.stroke();
	}
}

function shareDraw() {
	socket.emit('Server, here\'s a home-made draw', whitePaper.canvas.toDataURL("image/png"));
}

/*********************
 ** EVENT LISTENERS **
 *********************/
$('#drawToShare').mousedown(function(e) {

	var mouseX = e.pageX - this.offsetLeft;
	var mouseY = e.pageY - this.offsetTop;

	drawing = true;
	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	redraw();
});

$('#drawToShare').mousemove(function(e) {

	if (drawing) {
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
		redraw();
	}
});

$('#drawToShare').mouseup(function(e) {
	drawing = false;
});

$('#drawToShare').mouseleave(function(e) {
	drawing = false;
});

$('#clearDraw').click(fullClearDraw);
$('#shareDraw').click(shareDraw);
