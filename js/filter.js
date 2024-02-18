$(document).ready(() => {
	// When .filter--open.button is clicked
	$(".filter_form-open.button").click(() => {
		// Check its parent element ".filter_form" for the attribute "filter-state"
		const filterForm = $(".filter_form");
		let filterState = $(filterForm).attr("filter-state");
		console.log(filterForm);

		// If filter-state is not equal to open, set it to open. Otherwise, set it to closed.
		if (filterState !== "open") {
			$(filterForm).attr("filter-state", "open");
		} else {
			$(filterForm).attr("filter-state", "closed");
		}
	});

	// When the .filter--close_tab is clicked
	$(".filter_form-close_tab, .filter_form-mobile_back").click(() => {
		// Set the "filter-state" to closed
		const filterForm = $(".filter_form");
		$(filterForm).attr("filter-state", "closed");
	});
});
