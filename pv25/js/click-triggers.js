$(document).ready(function () {
	$(document).ready(function () {
		// Target elements using the user's specific attribute selector
		const copyButtons = $('[click-action="copy-description"]');
		const feedbackText = "✅ Copied!";

		// Iterate over each button found
		copyButtons.each(function () {
			const copyButton = $(this);
			const initialText = copyButton.text();

			// Find the closest parent that contains both the button and the content (.text_content)
			const copyContainer = copyButton.closest(".text_content");

			// Find the specific content element using the user's class (.description)
			const contentElement = copyContainer.find(".description");
			console.log(contentElement.text());

			const copyText = () => {
				// Use .text() to safely get the content from the jQuery object
				const textToCopy = contentElement.text();

				// 1. Create and append a temporary textarea to hold and select the text
				const tempInput = $("<textarea>")
					.val(textToCopy)
					// Make it invisible and off-screen
					.css({ position: "fixed", opacity: "0" });

				$("body").append(tempInput);

				tempInput.select();

				let success = false;
				try {
					// Execute the copy command
					success = document.execCommand("copy");
				} catch (err) {
					console.error("Copy failed (execCommand fallback):", err);
				}

				// Remove the temporary element immediately after the copy attempt
				tempInput.remove();

				if (success) {
					// 2. Show dynamic feedback message and update button appearance

					copyButton.text("Copied!");

					// Dynamically create and show the feedback message
					const feedbackMessage = $('<p class="temp-feedback">').text(feedbackText);

					// Append the feedback message right after the button within the flex container
					copyButton.parent().append(feedbackMessage);

					// 3. Hide feedback and restore button after a delay
					setTimeout(() => {
						copyButton.parent().find(".temp-feedback").remove(); // Remove the temporary message
						copyButton.text(initialText);
					}, 2000); // 2 seconds
				} else {
					console.warn("Could not use document.execCommand('copy'). Please copy manually.");
				}
			};

			// Attach the click event listener using jQuery's .on()
			copyButton.on("click", copyText);
		});
	});
});
