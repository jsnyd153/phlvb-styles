$(document).ready(() => {
	$(".toggle_content").each((index, element) => {
		const firstButton = $(element).find("button.tab").first();
		const tabIndex = $(element).find("button.tab").index(firstButton);
		const buttonLabel = firstButton.text();
		$(element).attr("state", tabIndex);
		$(element).attr("toggle-label", buttonLabel);
	});
});

$(".toggle_content").each((index, element) => {
	$(element)
		.find("button.tab")
		.click((event) => {
			const tabIndex = $(element).find("button.tab").index($(event.target));
			const buttonLabel = $(event.target).text();
			$(element).attr("state", tabIndex);
			$(element).attr("toggle-label", buttonLabel);
		});
});
