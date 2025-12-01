const customSessionData = [{
    "sessions": [{
        "id": "14022",
        "target": "que estu",
    },
    {
        "id": "14020",
        "target": "dolor emet",
        "value-2": 29
    },
    {
        "id": "14019",
        "target": "lorem ipsum",
        "value-2": 29
    },
    {
        "id": "14026",
        "target": "vilar holar",
        "value-2": 29
    }]
}];

 


/**
 * Fetches session data, speakers, and categories from the Sessionize API.
 * @returns {Promise<object>} A promise that resolves to an object containing sessions, speakers, and categories.
 */
function fetchSessionizeData() {
    console.log('fetchSessionizeData: Function called.');
    // London Data
    // const url = 'https://sessionize.com/api/v2/bokk47xg/view/All?preview=True';
    // Test API data
    const url = 'https://sessionize.com/api/v2/jl4ktls0/view/All';

    return $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    })
    .done(function(jsonData) {
        console.log('fetchSessionizeData: JSON data parsed. Top-level keys:', Object.keys(jsonData));
        const sessionsArray = jsonData.sessions;
        const speakersArray = jsonData.speakers;
        const categoriesArray = jsonData.categories;

        if (Array.isArray(sessionsArray)) {
            console.log('fetchSessionizeData: Sessions data (array). Count:', sessionsArray.length);
        } else {
            console.warn('fetchSessionizeData: "sessions" property is not an array or does not exist.');
        }
        if (Array.isArray(speakersArray)) {
            console.log('fetchSessionizeData: Speakers data (array). Count:', speakersArray.length);
        } else {
            console.warn('fetchSessionizeData: "speakers" property is not an array or does not exist.');
        }
        if (Array.isArray(categoriesArray)) {
            console.log('fetchSessionizeData: Categories data (array). Count:', categoriesArray.length);
        } else {
            console.warn('fetchSessionizeData: "categories" property is not an array or does not exist.');
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('fetchSessionizeData: Error during AJAX fetch:', textStatus, errorThrown);
        // Return a rejected promise with a default empty object on error
        return $.Deferred().reject({ sessions: [], speakers: [], categories: [] }).promise();
    })
    .then(function(jsonData) {
        return {
            sessions: jsonData.sessions || [],
            speakers: jsonData.speakers || [],
            categories: jsonData.categories || []
        };
    });
}
/**
 * Creates a new CMS item element using jQuery.
 * @param {object} session - The session data.
 * @param {Array} allSpeakers - Array of all speakers.
 * @param {Array} allCategories - Array of all categories.
 * @param {HTMLElement} templateElement - The DOM element to clone for the new item.
 * @returns {jQuery} The new jQuery-wrapped CMS item element.
 */
function createCmsItem(session, allSpeakers, allCategories, templateElement) {
    const sessionItem = $(templateElement).clone();


    const sessionlinkElement = sessionItem.find('[data-element="session-link"]');
        if (sessionlinkElement.length) {
        sessionlinkElement.attr('href', '#session-' + session.id || '');
    }


    // Set Title
    const titleElement = sessionItem.find('.featured_event-title');
    if (titleElement.length) {
        titleElement.text(session.title || '');
    }
    const bodyElement = sessionItem.find('[data-element="description"]');
    if (bodyElement.length) {
        bodyElement.text(session.description || '');
    }

const startTimeElement = sessionItem.find('[data-element="session-sort-time"]');
        const startDateString = session.startsAt;
        const endDateString = session.endsAt;

    if (startTimeElement.length) {
        if(startDateString){
        // Create a Date object from the string
        const dateObj = new Date(startDateString);


        const year = dateObj.toLocaleString('en-US', { year: 'numeric' });
        const month = dateObj.toLocaleString('en-US', { month: 'long' });
        const day = dateObj.toLocaleString('en-US', { day: 'numeric' });

        // Get hour and minute in 2-digit format
        const hour = dateObj.toLocaleString('en-US', { hour: 'numeric', hour12: false }); // 24-hour format
        const minute = dateObj.toLocaleString('en-US', { minute: '2-digit' });

        const sortDate = `${month} ${day}, ${year} ${hour}:${minute}`;

        startTimeElement.text(sortDate || '');
    } else {
        startTimeElement.text('');
    }
}
    
    const displayTimeElement = sessionItem.find('.featured_event-time');
    if (displayTimeElement.length) {

    if(startDateString){
       const startDateObj = new Date(startDateString);
        const startTime12hrFormat = startDateObj.toLocaleString('en-US', {
            hour: 'numeric',   // Numeric hour
            minute: '2-digit', // Two-digit minute
            hour12: true       // Use 12-hour format with AM/PM
        });
        displayTimeElement.text(startTime12hrFormat || '');
    }

      if(startDateString && endDateString){

        // Create a Date object from the string
        const startDateObj = new Date(startDateString);
        const endDateObj = new Date(endDateString);
        const startTime12hrFormat = startDateObj.toLocaleString('en-US', {
            hour: 'numeric',   // Numeric hour
            minute: '2-digit', // Two-digit minute
            hour12: true       // Use 12-hour format with AM/PM
        });
        const endTime12hrFormat = endDateObj.toLocaleString('en-US', {
            hour: 'numeric',   // Numeric hour
            minute: '2-digit', // Two-digit minute
            hour12: true       // Use 12-hour format with AM/PM
        });
             displayTimeElement.text(startTime12hrFormat + '-' + endTime12hrFormat || '');
    }
    
    else{
         displayTimeElement.text('');
    }
}


const dateElement = sessionItem.find('[data-element="session-date"]');
    if (dateElement.length) {

        const dateObj = new Date(startDateString);

        // Using toLocaleString with specific options
        const visDate = dateObj.toLocaleString('en-US', {
            month: 'short', 
            day: 'numeric'
        });

        dateElement.text(visDate || '');
    }


    const speakersElement = sessionItem.find('.featured_event-speakers');

    if (speakersElement.length && session.speakers && session.speakers.length > 0) {
        const speakerParagraphs = session.speakers.map(function(speakerId) {
            // Find the full speaker object using the ID
            const speaker = allSpeakers.find(function(s) {
                return s.id === speakerId;
            });

            const speakerFullName = speaker ? speaker.fullName : 'Unknown Speaker';
            const speakerTagline = speaker ? speaker.tagLine : 'Unknown Company';
            const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
            return `<div class="featured_event-speaker"><img class="profile-picture" src="${speakerImage}" alt="${speakerFullName} headshot"><span>${speakerFullName}, <span class="company">${speakerTagline}</span></span></div>`;
        });

        const allSpeakerParagraphsHtml = speakerParagraphs.join('');
        const wrappedHtml = `${allSpeakerParagraphsHtml}`;

        speakersElement.html(wrappedHtml);
    } else if (speakersElement.length) {
        speakersElement.hide();
    }

    // Process categoryItems
    const sessionTypeElement = sessionItem.find('[data-element="type"]');
    const sessionAudienceElement = sessionItem.find('[data-element="audience"]');
    const sessionLevelElement = sessionItem.find('[data-element="session-level"]');
    

    // Arrays to collect category names for each type
    const sessionTypeNames = [];
    const sessionAudienceNames = [];
    const sessionLevelNames = [];



    if (session.categoryItems && session.categoryItems.length > 0) {
        session.categoryItems.forEach(function(categoryId) {
            let foundCategory = null;
            let categoryGroupTitle = null;

            const foundInGroup = allCategories.some(function(group) {
                if (group.items && Array.isArray(group.items)) {
                    foundCategory = group.items.find(item => item.id === categoryId);
                    if (foundCategory) {
                        categoryGroupTitle = group.title;
                        return true;
                    }
                }
                return false;
            });

            if (foundInGroup && foundCategory.name) {
                // Collect the category name into the appropriate array
                if (categoryGroupTitle === 'Session format') {
                    sessionTypeNames.push(foundCategory.name);
                } else if (categoryGroupTitle === 'Track') {
                    sessionAudienceNames.push(foundCategory.name);
                } else if (categoryGroupTitle === 'Level') {
                    sessionLevelNames.push(foundCategory.name);
                }
            }
        });
    }

    // Assign the collected names, joined by a comma and space
    if (sessionTypeElement.length && sessionTypeNames.length > 0) {
        sessionTypeElement.text(sessionTypeNames.join(', '));
        sessionlinkElement.attr('session-type',sessionTypeNames )
    } else if (sessionTypeElement.length) {
        // Clear if no matching categories found
        sessionTypeElement.hide();
    }

    if (sessionAudienceElement.length && sessionAudienceNames.length > 0) {
        sessionAudienceElement.text(sessionAudienceNames.join(', '));
    } else if (sessionAudienceElement.length) {
        // Clear if no matching categories found
        sessionAudienceElement.text('');
    }

   // --- NEW LOGIC FOR CUSTOM SESSION DATA ---
    // Find the matching session in customSessionData
    // Ensure customSessionData is accessible and structured as expected
    if (customSessionData && customSessionData.length > 0 && customSessionData[0].sessions) {
        const matchingCustomSession = customSessionData[0].sessions.find(customSess => {
            // Sessionize IDs are numbers, custom data IDs are strings in your example
            // Ensure comparison is type-safe or convert
            return String(customSess.id) === String(session.id);
        });

        if (matchingCustomSession && matchingCustomSession.target) {
            const cardElement = sessionItem.find('.card');
            if (cardElement.length) {
                cardElement.attr('card-value', matchingCustomSession.target);
                cardElement.attr('new-value', matchingCustomSession["value-2"]);
                // console.log(`Session ID ${session.id}: Set card-type to "${matchingCustomSession.target}"`);
            } else {
                // console.warn(`Session ID ${session.id}: .card element not found for setting card-type.`);
            }
        } else {
            // console.log(`Session ID ${session.id}: No matching custom data found or 'target' property missing.`);
        }
    } else {
        // console.warn("customSessionData is not defined or not in the expected format.");
    }
    // --- END NEW LOGIC ---

    sessionItem.show(); // Ensure item is visible
    return sessionItem;
}

// Rest of your code (fetchSessionizeData and fsAttributes setup) remains the same
// ...

// Initialize F'inSweet Attributes for CMS Filter
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
    'cmsfilter',
    function(filterInstances) {
        console.log('cmsfilter callback triggered by fsAttributes!');
        if (!filterInstances || filterInstances.length === 0) {
            console.error("cmsfilter callback: filterInstances array is empty or undefined. Is your F'inSweet CMS Filter setup correct on the page?");
            return;
        }

        const filterInstance = filterInstances[0];

        if (!filterInstance) {
            console.error("cmsfilter callback: The first filterInstance is undefined. This is unexpected.");
            return;
        }

        const { listInstance } = filterInstance;
        const [firstItem] = listInstance.items;
        const itemTemplateElement = firstItem.element;

        fetchSessionizeData()
            .then(function(data) {
                const sessions = data.sessions;
                const allSpeakers = data.speakers;
                const allCategories = data.categories;

                console.log('cmsfilter callback: Sessions received from fetchSessionizeData:', sessions.length, 'items.');

                if (sessions.length === 0) {
                    console.warn('cmsfilter callback: No sessions to display. Clearing CMS list.');
                    listInstance.clearItems();
                    const $noResultsMessage = $('<div>').text("No sessions are currently scheduled.");
                    const $listWrapper = $('.w-dyn-list');
                    if ($listWrapper.length) {
                        $listWrapper.append($noResultsMessage);
                    }
                    return; // Stop execution if no sessions
                }

                listInstance.clearItems();
                const newCmsItems = sessions.map(function(session) {
                    return createCmsItem(session, allSpeakers, allCategories, itemTemplateElement);
                });

                // Convert jQuery objects back to raw DOM elements for listInstance.addItems
                const rawNewCmsItems = newCmsItems.map(function($item) {
                    return $item[0];
                });

                
                return listInstance.addItems(rawNewCmsItems);
            })
            .then(function() {
                console.log('cmsfilter callback: CMS list updated successfully.');
            })
            .then(function(data){
                // add click triggers after new elements are generated

                $('.session_modal-background').click(function(){
                    $(this).parents('.session_modal-modal').attr('modal-open','false');
                })
                $('a[modal-trigger="link-content"]').click(function(){
                    const sessionId = $(this).attr('href').substring('#session-'.length);
                    // updateSessionModal(sessionId, sessions, allSpeakers, allCategories);
                    $('.session_modal-modal').attr('modal-open','true');
                })
            })
            .catch(function(error) {
                console.error('cmsfilter callback: Error during CMS update process:', error);
                // Optionally display an error message to the user
                const $errorMessage = $('<div>').text("There was an error loading the sessions. Please try again later.");
                const $listWrapper = $('.w-dyn-list');
                if ($listWrapper.length) {
                    $listWrapper.append($errorMessage);
                }
            });
    }
]);

