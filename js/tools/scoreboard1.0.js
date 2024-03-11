$(document).ready(function () {
	$(".t-score-display-team").each(function () {
		//Find elements that correspond to this team
		const teamDisplay = $(this);
		const teamIdentifier = $(this).attr("display-for");

		//set name
		var teamName = $('[controls-for="' + teamIdentifier + '"]')
			.find('[control="name"]')
			.val();
		$(this).attr("team-name", teamName);

		//set color
		var teamColor = $('[controls-for="' + teamIdentifier + '"]')
			.find('[control="color"]')
			.val();
		$(this).attr("team-color", teamColor);
	});
});
