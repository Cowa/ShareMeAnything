/**************************************
 * TODO : it can be easily refactored *
 **************************************/

function hideAll() {
	$('#front').hide();
	$('#favorite').hide();
	$('#history').hide();
	$('#settings').hide();
	$('#about').hide();
}

$('.toggle-sb').click(function() {
	$('.ui.sidebar').sidebar({
		overlay: true
	}).sidebar('toggle');
});

$('#history-menu a').click(function() {
	hideAll();
	$('#history').show();
});

$('#favorite-menu a').click(function() {
	hideAll();
	$('#favorite').show();
});

$('#settings-menu a').click(function() {
	hideAll();
	$('#settings').show();
});

$('#about-menu a').click(function() {
	hideAll();
	$('#about').show();
});

$('#front-menu a').click(function() {
	hideAll();
	$('#front').show();
});
