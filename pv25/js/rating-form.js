$(document).ready(function () {
	console.log("is this thing even on?");
	// Select all slider inputs on the page
	$('input[type="range"]').each(function () {
		const $slider = $(this);
		const $parent = $slider.closest(".fs-filter-range");
		const $display = $parent.find(".range-description > div:nth-child(1)");

		const formatValue = (val) => parseFloat(val).toFixed(1);

		$display.text(formatValue($slider.val()));

		$slider.on("input", function () {
			$display.text(formatValue($(this).val()));
		});

		// Listen for changes on radio inputs
		$('.dropdown--list input[type="radio"]').on("change", function () {
			var $dropdown = $(this).closest(".fs-filter-dropdown");
			var selectedValue = $(this).val();
			$dropdown.find(".dropdown--button").text(selectedValue);
			$dropdown.removeClass("open");
		});

		$(document).ready(function () {
			const $raterIdInput = $("#rater-id");
			const $keepCheckbox = $("#keepRaterID");
			const storageKey = "storedRaterID";

			// 1. On page load, check if a value exists in sessionStorage
			const savedValue = sessionStorage.getItem(storageKey);
			if (savedValue) {
				$raterIdInput.val(savedValue);
				$keepCheckbox.prop("checked", true);
			}

			// Function to manage storage based on current state
			function handleStorage() {
				if ($keepCheckbox.is(":checked")) {
					// Save or update the value
					sessionStorage.setItem(storageKey, $raterIdInput.val());
				} else {
					// Clear the value if unchecked
					sessionStorage.removeItem(storageKey);
				}
			}

			// 2. Listen for changes on the Rater ID text input
			$raterIdInput.on("input", function () {
				handleStorage();
			});

			// 3. Listen for changes on the checkbox
			$keepCheckbox.on("change", function () {
				handleStorage();
			});
		});
	});

	document.addEventListener("DOMContentLoaded", () => {
		const ratingForm = document.getElementById("wf-form-Rating-Form");

		if (ratingForm) {
			ratingForm.addEventListener("submit", async function (e) {
				e.preventDefault();
				e.stopPropagation();

				// Gather all form data
				const data = {
					rater_id: document.getElementById("rater-id").value,
					player_name: document.getElementById("player-name").value,
					player_email: document.getElementById("player-email").value,
					// Radio Buttons
					rating_type:
						document.querySelector('input[name="Rating-Type"]:checked')?.value || "Not Specified",
					position:
						document.querySelector('input[name="Position"]:checked')?.value || "Not Specified",
					// Range Sliders (Converted to Floats for math/averaging later)
					attacking: parseFloat(document.getElementById("attackingSlider").value),
					blocking: parseFloat(document.getElementById("blockingSlider").value),
					defense: parseFloat(document.getElementById("defenseSlider").value),
					receive: parseFloat(document.getElementById("receiveSlider").value),
					setting: parseFloat(document.getElementById("settingSlider").value),
					serving: parseFloat(document.querySelector('input[name="serving"]').value),
				};

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
						throw new Error("Database submission failed");
					}
				} catch (err) {
					document.querySelector(".w-form-fail").style.display = "block";
					console.error("Submission error:", err);
				}
			});
		}
	});
});
