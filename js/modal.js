$(document).ready(function () {
	$('[trigger-el="modal"]').click(function (event) {
		event.preventDefault();
		var href = $(this).attr("href").replace("#", "");
		console.log("open", href);
		console.log('[modal-el="' + href + '"]');
		$('[modal-el="' + href + '"]').attr("modal-state", "active");
	});

	$('[trigger-el="modal-close"]').click(function (event) {
		console.log("close");
		event.preventDefault();
		$("[modal-el]").removeAttr("modal-state");
	});
});
