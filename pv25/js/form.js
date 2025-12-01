const stepsFrom = $('#wf-form-Data-Streaming-Awards-Nomination');
stepsFrom.each(function() {
    const thisForm = $(this);
    const wrapper = thisForm.find('.c26-form-step-wrapper');

    // Filter the steps to only include form groups that have at least one required input
    const steps = thisForm.find('.c25-form-group').filter(function() {
        return $(this).find('input[required], select[required], textarea[required]').length > 0;
    });

    const tracker = thisForm.find('.c26-form-tracker');
    const numberOfSteps = steps.length;

    // Function to add tracker items and set initial styling
    function addTrackerItems() {
        tracker.empty(); // Clear existing tracker items to prevent duplicates

        steps.each(function(index) { // Iterate over the filtered steps directly
            const currentFormGroup = $(this);
            const stepId = `formGroup${index + 1}`; // Create a unique ID for the form group

            // Add the ID to the form group
            currentFormGroup.attr('id', stepId+'group');
            currentFormGroup.append('<div class="scroll-anchor"></div>')
            currentFormGroup.find('.scroll-anchor').attr('id', stepId);

            // Create the anchor tag for the tracker item
            const trackerItemEl = $('<a>') // Changed from <div> to <a>
                .addClass('c26-form-tracker-item')
                .attr('complete', 'false')
                .attr('step', index + 1)
                .attr('href', `#${stepId}`); // Link to the form group's ID

            // Find the parent .c26-form-step-section and then the h3 within it
            const parentSection = currentFormGroup.closest('.c26-form-step-section');
            const h3Color = parentSection.find('h3').css('color');

            if (h3Color) {
                // Convert RGB to HEX if necessary (jQuery's .css('color') returns RGB)
                const hexColor = rgbToHex(h3Color);
                trackerItemEl.css('--theme--accent-light', hexColor);
            }

            tracker.append(trackerItemEl);
        });
    }

    // Helper function to convert RGB color strings to HEX
    function rgbToHex(rgb) {
        if (rgb.startsWith('#')) {
            return rgb;
        }

        const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!match) {
            return '#000000'; // Default to black if conversion fails
        }
        const toHex = function(c) {
            const hex = parseInt(c).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return '#' + toHex(match[1]) + toHex(match[2]) + toHex(match[3]);
    }

    // Call the function to add tracker items initially
    addTrackerItems();
    // $('.c26-form-tracker-item').localScroll({
    //         offset: -100
    //     });
  tracker.css('--_items', numberOfSteps)

    // Function to check validity of all inputs within a given form group
    function checkFormGroupValidity(formGroup) {
        let allInputsInGroupValid = true;

        formGroup.find('input, select, textarea').each(function() {
            const currentInput = $(this);
            let isInputValid = true; // Assume valid initially

            // --- Custom validation for multi-selects based on 'selected' class ---
            if (currentInput.attr('select-type') === 'checkbox') {
                const customUl = formGroup.find(`#${currentInput.attr('id')}-input`);
                // It's valid if at least one <li> inside the custom UL has the 'selected' class
                isInputValid = customUl.find('li.selected').length > 0;

                // Apply 'invalid' class directly to the custom UL for visual feedback
                if (isInputValid) {
                    customUl.removeClass('invalid');
                } else {
                    customUl.addClass('invalid');
                }
            } else {
                // For standard inputs, use native checkValidity()
                isInputValid = this.checkValidity();
                const hasValue = currentInput.val().trim() !== '';

                // Logic for adding/removing the 'invalid' class on the input element:
                if (!isInputValid && hasValue) {
                    currentInput.addClass('invalid');
                } else {
                    currentInput.removeClass('invalid');
                }
            }
            // --- End custom validation ---

            if (!isInputValid) {
                allInputsInGroupValid = false;
            }
        });
        return allInputsInGroupValid;
    }

    // Event listener for changes on inputs within the wrapper
    wrapper.on('change', 'input, select, textarea', function() {
        const input = $(this);
        const parentFormGroup = input.closest('.c25-form-group');

        if (parentFormGroup.length && steps.is(parentFormGroup)) {
            const index = steps.index(parentFormGroup);

            if (index !== -1) {
                const trackerItem = tracker.find(`.c26-form-tracker-item[step="${index + 1}"]`);

                if (trackerItem.length) {
                    const isFormGroupValid = checkFormGroupValidity(parentFormGroup);

                    if (isFormGroupValid) {
                        trackerItem.attr('complete', 'true');
                    } else {
                        trackerItem.attr('complete', 'false');
                    }
                }
            }
        }
    });

    // Initial check on page load for any pre-filled fields
    steps.each(function() {
        const currentFormGroup = $(this);
        const index = steps.index(currentFormGroup);
        const trackerItem = tracker.find(`.c26-form-tracker-item[step="${index + 1}"]`);

        if (trackerItem.length) {
            const isFormGroupValid = checkFormGroupValidity(currentFormGroup);

            if (isFormGroupValid) {
                trackerItem.attr('complete', 'true');
            } else {
                trackerItem.attr('complete', 'false');
            }
        }
    });


});