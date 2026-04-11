$(document).ready(function () {
	console.log("is this thing even on?");

	function handleRatingSliders() {
		$('input[type="range"]').each(function () {
			const $slider = $(this);
			const $parent = $slider.closest(".fs-filter-range");
			const $display = $parent.find(".range-description > div:nth-child(1)");

			const formatValue = (val) => parseFloat(val).toFixed(1);

			$display.text(formatValue($slider.val()));

			$slider.on("input", function () {
				$display.text(formatValue($(this).val()));
			});
		});
	}

	function handleDropdownRadios() {
		// Base open close functions are in js/dropdown.js
		$('.dropdown--list input[type="radio"]').on("change", function () {
			var $dropdown = $(this).closest(".fs-filter-dropdown");
			var selectedValue = $(this).val();
			$dropdown.find(".dropdown--button").text(selectedValue);
			$dropdown.removeClass("open");
		});
	}

	function handleRaterIdKeepOptions() {
		const $raterIdInput = $("#rater-id");
		const $keepCheckbox = $("#keepRaterID");
		const storageKey = "storedRaterID";
		//check if a value exists in sessionStorage
		const savedValue = sessionStorage.getItem(storageKey);
		if (savedValue) {
			$raterIdInput.val(savedValue);
			$keepCheckbox.prop("checked", true);
		}
		function handleStorage() {
			if ($keepCheckbox.is(":checked")) {
				// Save or update the value
				sessionStorage.setItem(storageKey, $raterIdInput.val());
			} else {
				// Clear the value if unchecked
				sessionStorage.removeItem(storageKey);
			}
		}
		// Listen for changes on the Rater ID text input
		$raterIdInput.on("input", function () {
			handleStorage();
		});

		//  Listen for changes on the checkbox
		$keepCheckbox.on("change", function () {
			handleStorage();
		});
	}
	handleDropdownRadios();
	handleRaterIdKeepOptions();
	handleRatingSliders();
});

$(document).ready(function () {
	const ratingForm = document.getElementById("wf-form-Rating-Form");
	const $errorBlock = $(".w-form-fail");
	const $errorText = $errorBlock.find("div");

	if (ratingForm) {
		ratingForm.addEventListener("submit", async function (e) {
			e.preventDefault();
			e.stopPropagation();

			// 1. Reset UI and clear previous errors
			$errorBlock.hide();
			$(".input_input").css("border-color", ""); // Reset custom borders
			const $submitButton = $(this).find('input[type="submit"]');
			const originalButtonText = $submitButton.val();

			// 2. Data Collection
			const data = {
				rater_id: document.getElementById("rater-id").value.trim(),
				player_name: document.getElementById("player-name").value.trim(),
				player_email: document.getElementById("player-email").value.trim(),
				rating_type: document.querySelector('input[name="Rating-Type"]:checked')?.value,
				position: document.querySelector('input[name="Position"]:checked')?.value,
				attacking: parseFloat(document.getElementById("attackingSlider").value),
				blocking: parseFloat(document.getElementById("blockingSlider").value),
				defense: parseFloat(document.getElementById("defenseSlider").value),
				receive: parseFloat(document.getElementById("receiveSlider").value),
				setting: parseFloat(document.getElementById("settingSlider").value),
				serving: parseFloat(document.querySelector('input[name="serving"]').value),
			};

			// 3. VALIDATION CHECK
			let errors = [];
			if (!data.rater_id) {
				errors.push("Rater ID is required.");
				$("#rater-id").closest(".input_input").css("border-color", "red");
			}
			if (!data.player_name) {
				errors.push("Player Name is required.");
				$("#player-name").closest(".input_input").css("border-color", "red");
			}
			if (!data.player_email) {
				errors.push("Valid Player Email is required.");
				$("#player-email").closest(".input_input").css("border-color", "red");
			}
			if (!data.rating_type) {
				errors.push("Please select a Rating Type (Indoor/Grass).");
			}
			if (!data.position) {
				errors.push("Please select a Position.");
			}

			if (errors.length > 0) {
				$errorText.html(errors.join("<br>")); // Show all errors separated by lines
				$errorBlock.show();
				return; // Stop the function here
			}

			// 4. If valid, proceed to fetch
			$submitButton.val("Submitting...");

			try {
				const response = await fetch(
					"https://phlvb-rating-system.netlify.app/.netlify/functions/submit-rating/",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(data),
					},
				);

				if (response.ok) {
					ratingForm.style.display = "none";
					document.querySelector(".w-form-done").style.display = "block";
				} else {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(errorData.error || "Server error.");
				}
			} catch (err) {
				$errorText.text("Submission failed: " + err.message);
				$errorBlock.show();
				$submitButton.val(originalButtonText);
			}
		});
	}
});
