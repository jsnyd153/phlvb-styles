$(document).ready(function () {
	$(".tab").click(function () {
		// Get the index of the clicked tab relative to its siblings
		var tabIndex = $(this).index();

		// Set the state attribute of the parent atomgrid element to the index
		$(this).parents("atomgrid").attr("state", tabIndex);
	});
});
