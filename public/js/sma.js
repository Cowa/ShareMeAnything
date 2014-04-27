$('.toggle-sb').click(
	function() {
		$('.ui.sidebar').sidebar({
			overlay: true
		}).sidebar('toggle');
	}
);

