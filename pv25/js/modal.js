// Function to handle modal trigger click

function handleModalTriggerClick(event) {
	const modalName = $(this).attr("modal-trigger");
	const modalDialog = $(`[modal-dialog="${modalName}"]`);
	if (modalDialog.length > 0) {
		modalDialog[0].showModal();
	}
}

function handleModalCloseClick(event) {
	if ($(this).attr("modal-close") === "parent") {
		// Find the parent dialog element and close it
		const parentDialog = $(this).closest("dialog");
		if (parentDialog.length > 0) {
			parentDialog[0].close();
		}
	}
}

$("[modal-trigger]").click(handleModalTriggerClick);
$(document).on("click", '[modal-close="parent"]', handleModalCloseClick);
