//=============================================
//============= SERVE CONTROLS ===============
//=============================================
// $(document).ready(function () {
// 	// Function to initialize the behavior
// 	function initializeScoreDisplayService() {
// 		$(".t-score-display-service").each(function () {
// 			const parentWrapper = $(this).closest(".t-score-wrapper");
// 			const playersFormat = parentWrapper.attr("players-format");
// 			$(this).empty(); // Clear previous span tags

// 			// Add span tags based on players-format attribute
// 			for (let i = 0; i < playersFormat; i++) {
// 				$(this).append("<span></span>");
// 			}

// 			// Event listener for control buttons
// 			parentWrapper.find('[control="players-format"]').click(function () {
// 				const value = $(this).attr("value");
// 				parentWrapper.attr("players-format", value);
// 				initializeScoreDisplayService(); // Re-run the function to update spans
// 			});

// 			// Event listener for score display service
// 			$(this).click(function () {
// 				const teamDisplay = $(this).closest(".t-score-wrapper").find(".t-score-display-team");
// 				let teamServerNumber = parseInt(teamDisplay.attr("team-server-number")) || 0;
// 				teamServerNumber = (teamServerNumber % playersFormat) + 1;
// 				teamDisplay.attr("team-server-number", teamServerNumber);
// 			});
// 		});
// 	}

// 	// Call the function to initialize the behavior
// 	initializeScoreDisplayService();
// });

//=============================================
//============= SCORE CONTROLS ===============
//=============================================

$(document).ready(function () {
	// Update team score on page load
	$('[control="score"]').each(function () {
		var teamID = $(this).parents("[controls-for]").attr("controls-for");
		var initialScore = $(this).val();
		$('.t-score-display-team[display-for="' + teamID + '"]').attr("team-score", initialScore);
	});

	// Update team score when score input value changes
	$('[control="score"]').on("input", function () {
		var teamID = $(this).parents("[controls-for]").attr("controls-for");
		var newScore = $(this).val();
		$('.t-score-display-team[display-for="' + teamID + '"]').attr("team-score", newScore);
	});

	// Update score on click of score-action="up"
	$('[score-action="up"]').on("click", function () {
		var teamID = $(this).parents("[display-for]").attr("display-for");

		var scoreInput = $('[controls-for="' + teamID + '"]').find('[control="score"]');
		var currentScore = parseInt(scoreInput.val());
		var newScore = currentScore + 1;
		scoreInput.val(newScore).trigger("input");
	});

	// Update score on click of score-action="down"
	$('[score-action="down"]').on("click", function () {
		var teamID = $(this).parents("[display-for]").attr("display-for");

		var scoreInput = $('[controls-for="' + teamID + '"]').find('[control="score"]');
		var currentScore = parseInt(scoreInput.val());
		var newScore = currentScore - 1;
		scoreInput.val(newScore).trigger("input");
	});
});

//=============================================
//============= NAME CONTROLS ===============
//=============================================

$(document).ready(function () {
	// Update team name on page load
	$(".t-score-display-team").each(function () {
		var displayFor = $(this).attr("display-for");
		var teamName = $('[controls-for="' + displayFor + '"]')
			.find('[control="name"]')
			.val();
		$(this).attr("team-name", teamName);
	});

	// Update team name when control name value changes
	$('[control="name"]').on("input", function () {
		var displayFor = $(this).closest("[controls-for]").attr("controls-for");
		var teamDisplay = $('.t-score-display-team[display-for="' + displayFor + '"]');
		var newName = $(this).val();
		teamDisplay.attr("team-name", newName);
	});
});

//=============================================
//============= COLOR CONTROLS ===============
//=============================================
// When the document is ready
$(document).ready(function () {
	// For each element with class .t-score-display-team
	$(".t-score-display-team").each(function () {
		// Get the value of the [display-for] attribute
		const thisTeam = $(this);
		var displayFor = $(this).attr("display-for");

		// Find the element whose [controls-for] matches [display-for]
		var correspondingElement = $('[controls-for="' + displayFor + '"]');

		// Find the input [control="color"] inside the corresponding element
		var colorInput = correspondingElement.find('[control="color"]');
		console.log(colorInput);
		// Set the initial style for --t-background_color
		$(this).css("--t-background_color", colorInput.val());

		// Whenever the value of [control="color"] changes
		colorInput.on("change", function () {
			// Set the style --t-background_color on the corresponding .t-score-display-team element
			console.log($(this).val());
			$(thisTeam).css("--t-background_color", $(this).val());
		});
	});
});

//=============================================
//============= NAV CONTROLS ===============
//=============================================

$(document).ready(function () {
	// Function to initialize the behavior
	function toggleNav() {
		// Event listener for score display service
		$('[control="navigation-open"]').click(function () {
			$(".t-score-wrapper").attr("nav-state", "active");
		});
		$('[control="navigation-close"]').click(function () {
			$(".t-score-wrapper").attr("nav-state", "closed");
		});
	}
	// Call the function to initialize the behavior
	toggleNav();
});

//=============================================
//============= TAB CONTROLS ===============
//=============================================
// When the document is ready
$(document).ready(function () {
	// For each element with class .t-score-display-team
	$(".tab-container").each(function () {
		const tabContainer = $(this);
		const controlProperty = $(this).attr("control");
		console.log(controlProperty, tabContainer);
		tabContainer.find("button").click(function () {
			const value = $(this).attr("value");
			const buttonNumber = $(this).index();
			$(".t-score-wrapper").attr(controlProperty, value);
			$(tabContainer).attr("state", buttonNumber);
		});
	});
});

//=============================================
//============= SIDEOUT CONTROLS ===============
//=============================================
$(document).ready(function () {
	// Event listener for the click event on elements with [control="sideout"]
	$('[control="sideout"]').on("click", function () {
		// Find each .t-score-display-team element
		$(".t-score-display-team").each(function () {
			// Get the value of the current team-serve attribute
			var teamServe = $(this).attr("team-serve");

			// Toggle the value of team-serve attribute
			if (teamServe === "current") {
				$(this).attr("team-serve", "");
			} else {
				$(this).attr("team-serve", "current");
			}
		});
	});
});
