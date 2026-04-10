// Select all slider inputs on the page
const sliders = document.querySelectorAll('input[type="range"]');

sliders.forEach((slider) => {
	// Find the display element relative to this specific slider's parent
	const parent = slider.closest(".fs-filter-range");
	const display = parent.querySelector(".range-description > div:nth-child(1)");

	slider.addEventListener("input", function () {
		// Update the text of the display in this specific group
		display.textContent = this.value;
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
