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

$('#history-menu').click(function() {
	hideAll();
	$('#history').show();
});

$('#favorite-menu').click(function() {
	hideAll();
	$('#favorite').show();
});

$('#settings-menu').click(function() {
	hideAll();
	$('#settings').show();
});

$('#about-menu').click(function() {
	hideAll();
	$('#about').show();
});

$('#front-menu').click(function() {
	hideAll();
	$('#front').show();
});