$(document).ready(() => {
	$("header.header_nav").attr("state", "closed");

	$(".header_nav--burger").click(function () {
		var header = $(".header_nav");
		var currentState = header.attr("state");
		if (currentState === "open") {
			header.attr("state", "close");
		} else {
			header.attr("state", "open");
		}
	});
});
