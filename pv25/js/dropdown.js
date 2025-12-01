function toggleDropdown() {
	$('[action="toggle-dropdown"]').each(function () {
		$(this).click(function () {
			$([(action = "toggle-dropdown")])
				.parent("open")
				.removeClass("open");
			$(this).parent().toggleClass("open");
		});
	});
	$(".dropdown--container").each(function () {
		const items = $(this).find(".multi-select-input").length;
		$(this).css("--_items", items.toString());
	});
} //toggleDropdown()
$(document).ready(function () {
	toggleDropdown();
});
