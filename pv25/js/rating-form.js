$(document).ready(function () {
	console.log("is this thing even on?");

	//also need to run the inner function on load for cahced form values
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

	//also need to run the inner function on load for cahced form values
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
			// Read each skill by its (unique) name attribute. If the row has been
			// toggled to "No rating" the slider is disabled and we send null, which
			// the backend stores as NULL and skips in all calculations.
			const readSkill = (name) => {
				const input = ratingForm.querySelector('input[name="' + name + '"]');
				if (!input) return null;
				const range = input.closest(".fs-filter-range");
				if (input.disabled || (range && range.classList.contains("is-no-rating"))) {
					return null;
				}
				const value = parseFloat(input.value);
				return isNaN(value) ? null : value;
			};

			const data = {
				rater_id: document.getElementById("rater-id").value.trim(),
				player_name: document.getElementById("player-name").value.trim(),
				player_email: document.getElementById("player-email").value.trim(),
				rating_type: document.querySelector('input[name="Rating-Type"]:checked')?.value,
				position: document.querySelector('input[name="Position"]:checked')?.value,
				attacking: readSkill("attacking"),
				blocking: readSkill("blocking"),
				defense: readSkill("defense"),
				receive: readSkill("receive"),
				setting: readSkill("setting"),
				serving: readSkill("serving"),
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

// ---------------------------------------------------------------------------
// "No rating" per-skill toggle
//
// Long-press (or right-click) a skill row to open a small context menu that
// lets the rater toggle that skill to "No rating". When off, the slider is
// disabled/greyed and its value display reads "No rating"; on submit that
// skill is sent as null. Long-press again to toggle it back on.
// ---------------------------------------------------------------------------
$(document).ready(function () {
	const form = document.getElementById("wf-form-Rating-Form");
	if (!form) return;

	const ranges = form.querySelectorAll(".fs-filter-range");
	if (!ranges.length) return;

	const LONG_PRESS_MS = 450;
	const MOVE_CANCEL_PX = 10;

	// Toggle a single skill row on/off.
	function setNoRating(range, on) {
		const input = range.querySelector('input[type="range"]');
		const valueEl = range.querySelector(".range-description > div");
		if (!input) return;

		if (on) {
			range.classList.add("is-no-rating");
			input.disabled = true;
			if (valueEl) valueEl.textContent = "No rating";
		} else {
			range.classList.remove("is-no-rating");
			input.disabled = false;
			if (valueEl) valueEl.textContent = parseFloat(input.value).toFixed(1);
		}
	}

	// --- Build the context menu (one shared element) ---
	const menu = document.createElement("div");
	menu.className = "rating-context-menu";
	menu.setAttribute("role", "menu");
	menu.innerHTML =
		'<button type="button" class="rating-context-menu-toggle" role="menuitemcheckbox">' +
		'<span class="rating-context-menu-label">No rating</span>' +
		'<span class="rating-context-menu-switch" aria-hidden="true"></span>' +
		"</button>";
	document.body.appendChild(menu);

	const toggleBtn = menu.querySelector(".rating-context-menu-toggle");
	let activeRange = null;

	function closeMenu() {
		menu.classList.remove("open");
		activeRange = null;
	}

	function openMenu(range, x, y) {
		activeRange = range;
		const isOff = range.classList.contains("is-no-rating");
		toggleBtn.classList.toggle("is-on", isOff);
		toggleBtn.setAttribute("aria-checked", String(isOff));

		// Show first so we can measure, then clamp within the viewport.
		menu.classList.add("open");
		const rect = menu.getBoundingClientRect();
		const pad = 8;
		let left = x;
		let top = y;
		if (left + rect.width + pad > window.innerWidth) left = window.innerWidth - rect.width - pad;
		if (top + rect.height + pad > window.innerHeight) top = y - rect.height;
		menu.style.left = Math.max(pad, left) + "px";
		menu.style.top = Math.max(pad, top) + "px";
	}

	toggleBtn.addEventListener("click", function () {
		if (!activeRange) return;
		setNoRating(activeRange, !activeRange.classList.contains("is-no-rating"));
		closeMenu();
	});

	// --- Long-press + right-click wiring per row ---
	ranges.forEach(function (range) {
		let timer = null;
		let startX = 0;
		let startY = 0;
		let longPressed = false;

		const cancel = () => {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		};

		range.addEventListener("pointerdown", function (e) {
			if (e.button && e.button !== 0) return; // ignore non-primary buttons
			longPressed = false;
			startX = e.clientX;
			startY = e.clientY;
			cancel();
			timer = setTimeout(function () {
				longPressed = true;
				openMenu(range, startX, startY);
			}, LONG_PRESS_MS);
		});

		range.addEventListener("pointermove", function (e) {
			if (!timer) return;
			if (
				Math.abs(e.clientX - startX) > MOVE_CANCEL_PX ||
				Math.abs(e.clientY - startY) > MOVE_CANCEL_PX
			) {
				cancel();
			}
		});

		["pointerup", "pointerleave", "pointercancel"].forEach(function (evt) {
			range.addEventListener(evt, cancel);
		});

		// Suppress the click/value-change that follows a long-press.
		range.addEventListener(
			"click",
			function (e) {
				if (longPressed) {
					e.preventDefault();
					e.stopPropagation();
					longPressed = false;
				}
			},
			true,
		);

		// Right-click / native long-press callout opens our menu instead.
		range.addEventListener("contextmenu", function (e) {
			e.preventDefault();
			cancel();
			openMenu(range, e.clientX, e.clientY);
		});
	});

	// --- Dismiss the menu ---
	document.addEventListener(
		"pointerdown",
		function (e) {
			if (menu.classList.contains("open") && !menu.contains(e.target)) closeMenu();
		},
		true,
	);
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") closeMenu();
	});
	window.addEventListener("scroll", closeMenu, true);
	window.addEventListener("resize", closeMenu);
});
