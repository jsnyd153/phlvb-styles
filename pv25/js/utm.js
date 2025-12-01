 // UTM properties array
const utmProperties = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'placement', 'device', 'creative'];

// Check if UTMs exist in the URL and store them in local storage
function storeUTMsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);

    // Check if new UTMs exist in the URL
    let newUTMsExist = false;
    utmProperties.forEach(property => {
        if (urlParams.has(property)) {
            newUTMsExist = true;
        }
    });

    // Clear existing UTMs from local storage only if new UTMs exist in the URL
    if (newUTMsExist) {
        utmProperties.forEach(property => {
            localStorage.removeItem(property);
        });
    }

    // Store new UTMs in local storage
    utmProperties.forEach(property => {
        const value = urlParams.get(property);
        if (value) {
            localStorage.setItem(property, value);
        }
    });
}

// Function to retrieve and append UTMs from local storage
function appendUTMsToLinks() {
    const utmValues = {};
    utmProperties.forEach(property => {
        utmValues[property] = localStorage.getItem(property);
    });

    const internalLinks = document.querySelectorAll('a[href]');
    internalLinks.forEach(link => {
        let href = link.getAttribute('href');
        const url = new URL(href, window.location.href);

        // Check if the link is external
        if (url.hostname !== window.location.hostname) {
            // Append UTMs to external links
            utmProperties.forEach(property => {
                const value = utmValues[property];
                if (value) {
                    href += (href.includes('?') ? '&' : '?') + `${property}=${value}`;
                }
            });
            link.setAttribute('href', href);
        }
    });
}

function setFormFields(){
// Iterate through the UTM properties
    utmProperties.forEach(property => {
        // Get the value from local storage
        const value = localStorage.getItem(property);
        
        // Find the input element with the matching ID
        const inputField = document.getElementById(property);

        if (value && inputField) {
            inputField.value = value;
        }
    });
}

// Check if UTMs exist in the URL on page load
document.addEventListener('DOMContentLoaded', function() {
    storeUTMsFromURL();
    appendUTMsToLinks();
    setFormFields();
});
