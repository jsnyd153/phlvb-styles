// Define your custom session data (keep this at the top of your script)
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

// Declare variables in a higher scope to store fetched data
// These will be populated once fetchSessionizeData() completes
let globalSessionsData = [];
let globalSpeakersData = [];
let globalCategoriesData = []; 
let globalRoomsData = []; 

/**
 * Fetches session data, speakers, and categories from the Sessionize API.
 * @returns {Promise<object>} A promise that resolves to an object containing sessions, speakers, and categories.
 */
function fetchSessionizeData() {
    console.log('fetchSessionizeData: Function called.');
    const url = 'https://sessionize.com/api/v2/jl4ktls0/view/All';
    // const url = 'https://sessionize.com/api/v2/bokk47xg/view/All?preview=True';

    return $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json'
    })
    .done(function(jsonData) {
        console.log('fetchSessionizeData: JSON data parsed. Top-level keys:', Object.keys(jsonData));
        if (!jsonData.sessions || !Array.isArray(jsonData.sessions)) {
            console.warn('fetchSessionizeData: "sessions" property is not an array or does not exist.');
        }
        if (!jsonData.speakers || !Array.isArray(jsonData.speakers)) {
            console.warn('fetchSessionizeData: "speakers" property is not an array or does not exist.');
        }
        if (!jsonData.categories || !Array.isArray(jsonData.categories)) {
            console.warn('fetchSessionizeData: "categories" property is not an array or does not exist.');
        }
        if (!jsonData.rooms || !Array.isArray(jsonData.categories)) {
            console.warn('fetchSessionizeData: "rooms" property is not an array or does not exist.');
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.error('fetchSessionizeData: Error during AJAX fetch:', textStatus, errorThrown);
        return $.Deferred().reject({ sessions: [], speakers: [], categories: [], rooms: [] }).promise();
    })
    .then(function(jsonData) {
        // Populate the higher-scoped variables with the fetched data
        globalSessionsData = jsonData.sessions || [];
        globalSpeakersData = jsonData.speakers || [];
        globalCategoriesData = jsonData.categories || [];
        globalRoomsData = jsonData.rooms || [];

        return {
            sessions: globalSessionsData,
            speakers: globalSpeakersData,
            categories: globalCategoriesData,
            rooms:globalRoomsData
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
function createCmsItem(session, allSpeakers, allCategories, allRooms, templateElement) {
    const sessionItem = $(templateElement).clone();
    
    const gridSessionlinkElement = sessionItem.find('.event_card-link[ct-el="session-link"]');
    const featureSessionlinkElement = sessionItem.find('.featured_event-content[ct-el="session-link"]');


    // Get Room Name
    //=============================
        let roomName;
        if (session.roomId) { 
            const room = allRooms.find(s => s.id === session.roomId); 
            roomName = room ? room.name : 'Unknown Room'; 
        } 
    // Format Dates
    //=============================
        let startTime;
        if (session.startsAt) {
            const dateObj = new Date(session.startsAt);
            startTime = dateObj.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        let endTime;
        if (session.endsAt) {
            const dateObj = new Date(session.endsAt);
            startTime = dateObj.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        let sortDate;
        if (session.startsAt) {
        const dateObj = new Date(session.startsAt);
            const year = dateObj.toLocaleString('en-US', { year: 'numeric' });
            const month = dateObj.toLocaleString('en-US', { month: 'long' });
            const day = dateObj.toLocaleString('en-US', { day: 'numeric' });
            const hour = dateObj.toLocaleString('en-US', { hour: 'numeric', hour12: false });
            const minute = dateObj.toLocaleString('en-US', { minute: '2-digit' });
            // session-sort-time: "September 16, 2023 9:00"
            sortDate = `${month} ${day}, ${year} ${hour}:${minute}`;
        
        }
    //Seperate Categories
    //=============================

        const sessionTypeNames = [];
        const sessionAudienceNames = [];
        const sessionLevelNames = [];


        if (session.categoryItems && session.categoryItems.length > 0) {
        session.categoryItems.forEach(function(categoryId) {
            let foundCategory = null;
            let categoryGroupTitle = null;
            //Loop through Categories list
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
            // seperate returns values in to arrays for the differnent categories
            if (foundInGroup && foundCategory.name) {
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

    //speakers
    const speakerTextNames = [];
    const speakerPictureNamesHtml = [];
        if (session.speakers && session.speakers.length > 0) {
        speakerNames = session.speakers.map(function(speakerId) {
            const speaker = allSpeakers.find(s => s.id === speakerId);
            
            const speakerFullName = speaker ? speaker.fullName : 'Unknown Speaker';
            const speakerTagline = speaker ? speaker.tagLine : 'Unknown Company';
            const speakerNamesHtml = `<span>${speakerFullName}, <span class="company">${speakerTagline}</span></span>`;

            const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
            speakerTextNames.push(speakerNamesHtml);
            
            const speakerPicturesHtml =  `<div class="featured_event-speaker"><img class="profile-picture" src="${speakerImage}" alt="${speakerFullName} headshot"><span>${speakerFullName}, <span class="company">${speakerTagline}</span></span></div>`;
            speakerPictureNamesHtml.push(speakerPicturesHtml);
        });
  
    }

       
    //populate fields for Grid View
    if(gridSessionlinkElement.length ){
        console.log('gridSessionlinkElement format' )
        gridSessionlinkElement.attr('href', '#session-' + session.id || '').attr('session-type', sessionTypeNames[0]);
        
        const titleEl = sessionItem.find('[ct-el="session-title"]');
        const startTimeEl = sessionItem.find('[ct-el="session-start-time"]');
        const typeEl = sessionItem.find('[ct-el="type"]');
        const speakerListEl = sessionItem.find('[ct-el="speaker-list"]');
        const locationEl = sessionItem.find('[ct-el="location"]');
        
        titleEl.text(session.title || '');
        locationEl.text(roomName || '');
        startTimeEl.text(startTime || '');
        typeEl.text(sessionTypeNames.join(', '));
        speakerListEl.html(speakerTextNames.join('/ '));
    }//gridSessionlinkElement

    if(featureSessionlinkElement.length ){
        console.log('featureSessionlinkElement format' )
        featureSessionlinkElement.attr('href', '#session-' + session.id || '').attr('session-type', sessionTypeNames[0]);

        const titleEl = sessionItem.find('[ct-el="session-title"]');
        const timeEl = sessionItem.find('[ct-el="session-time-full"]');
        const typeEl = sessionItem.find('[ct-el="type"]');
        const speakerListEl = sessionItem.find('[ct-el="speaker-list"]');
        const locationEl = sessionItem.find('[ct-el="location"]');
        const audienceEl = sessionItem.find('[fs-cmsfilter-field="audience"]');

        titleEl.text(session.title || '');
        locationEl.text(roomName || '');
        timeEl.text(startTime + ' - ' + endTime || '');
        typeEl.text(sessionTypeNames.join(', '));
        console.log(audienceEl.html());
        audienceEl.text(sessionTypeNames.join(', '));
        speakerListEl.html(speakerPictureNamesHtml.join('/ '));


    }//featureSessionlinkElement




    // Custom Session Data (target and value-2)
    // if (customSessionData && customSessionData.length > 0 && customSessionData[0].sessions) {
    //     const matchingCustomSession = customSessionData[0].sessions.find(customSess => String(customSess.id) === String(session.id));

    //     if (matchingCustomSession) {
    //         const cardElement = sessionItem.find('.card'); // Assuming your card has class "card"
    //         if (cardElement.length) {
    //             if (matchingCustomSession.target) {
    //                 cardElement.attr('card-value', matchingCustomSession.target);
    //             }
    //             if (matchingCustomSession["value-2"]) {
    //                 cardElement.attr('new-value', matchingCustomSession["value-2"]);
    //             }
    //         }
    //     }
    // }

    sessionItem.show();
    return sessionItem;
}

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

        const filterInstance = filterInstances[0]; // Assuming it's the first one, or you'll need to find it by attribute

        if (!filterInstance) {
            console.error("cmsfilter callback: The first filterInstance is undefined. This is unexpected.");
            return;
        }

        const { listInstance } = filterInstance;
        const [firstItem] = listInstance.items;
        const itemTemplateElement = firstItem.element;

        fetchSessionizeData()
            .then(function(data) {
                // data.sessions, data.speakers, data.categories are already assigned
                // to global variables inside fetchSessionizeData's .then() block
                const sessions = data.sessions;
                const allSpeakers = data.speakers;
                const allCategories = data.categories;
                const allRooms = data.rooms;

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
                    return createCmsItem(session, allSpeakers, allCategories, allRooms, itemTemplateElement);
                });

                // Convert jQuery objects back to raw DOM elements for listInstance.addItems
                const rawNewCmsItems = newCmsItems.map(function($item) {
                    return $item[0];
                });

                return listInstance.addItems(rawNewCmsItems);
            })
            .then(function() {
                console.log('cmsfilter callback: CMS list updated successfully.');

                // Add triggers to elements after they've been generated and added to the DOM


                // close modals
                $('.session_modal-close').click(function(){
                    $('.session_modal-modal')[0].close();
                    history.replaceState(null, '', window.location.href.split('#')[0]);
                });

                $(document).on('click', 'dialog', function(event) {
                    // Check if the click occurred directly on the dialog element itself (the backdrop)
                    // and not on its content.
                    if ($(event.target).is(this)) {
                        $(this).get(0).close();
                        history.replaceState(null, '', window.location.href.split('#')[0]);
                    }
                });

                //Click Trigger
                $('a[modal-trigger="session-modal"]').click(function(e){
                    // e.preventDefault();
                    $('.speaker_modal-modal')[0].close();
                    console.log('Modal trigger clicked');
                    const href = $(this).attr('href');
                    console.log('clickedurl', href);
                    const sessionId = $(this).attr('href').substring('#session-'.length);

                    if (sessionId && globalSessionsData.length > 0) {
                        $('.session_modal-modal')[0].showModal();
                        updateSessionModal(sessionId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
                    } else {
                        console.warn('Cannot update modal: Session ID or fetched data is missing.');
                    }
                });


                addClickSpeakerTrigger();




                $(document).ready(function(){
                    const url = window.location.href;
                    const urlID = url.substring(url.indexOf("#") + 1);

                    if (urlID.includes("session")) {
                         const sessionId =  urlID.substring('session-'.length);
                         $('.session_modal-modal')[0].showModal();
                        updateSessionModal(sessionId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
                    } 
                    if (urlID.includes("speaker")) {
                        
                         const speakerId = urlID.substring('speaker-'.length);
                         $('.speaker_modal-modal')[0].showModal();
                        updateSpeakerModal(speakerId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
                    }
                })
            })
            .catch(function(error) {
                console.error('cmsfilter callback: Error during CMS update process:', error);
                const $errorMessage = $('<div>').text("There was an error loading the sessions. Please try again later.");
                const $listWrapper = $('.w-dyn-list');
                if ($listWrapper.length) {
                    $listWrapper.append($errorMessage);
                }
            });
    }
]);

// --- Update Session Modal Function ---
// This function will now receive the session ID and all relevant data arrays
function updateSessionModal(sessionId, allSessions, allSpeakers, allCategories, allRooms) {
    console.log(`Updating modal for session ID: ${sessionId}`);

    // Find the specific session object based on the ID
    const session = allSessions.find(s => String(s.id) === String(sessionId));

    if (session) {
        console.log('Found session for modal:', session.title);

        // Select your modal's container element (assuming it's a static element on the page)
        const modal = $('.session_modal-modal'); // Adjust selector if your modal is different

        // Populate common modal elements
        modal.find('[data-element="session-title"]').text(session.title || ''); // Example for modal title
        modal.find('[data-element="description"]').text(session.description || ''); // Example for modal description

        // Populate speakers in modal (similar logic to createCmsItem)
        const modalSpeakersElement = modal.find('.session_modal-speakers'); // Assuming you have a container for speakers in your modal


        if (modalSpeakersElement.length && session.speakers && session.speakers.length > 0) {
            const speakerHtmls = session.speakers.map(speakerId => {
                const speaker = allSpeakers.find(s => s.id === speakerId);
                const speakerID = speaker ? speaker.id : '0000';
                const speakerFullName = speaker ? speaker.fullName : 'Unknown Speaker';
                const speakerTagline = speaker ? speaker.tagLine : 'Unknown Company';
                const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
                // You might need a more complex HTML structure for speaker in modal
                return `<a href="#speaker-${speakerID}" class="session_modal-speaker" modal-trigger="speaker-modal">
                            <img class="session_modal-headshot" src="${speakerImage}" alt="${speakerFullName} headshot">
                            <div class="session_modal-speaker-text">
                                <div class="tag session_modal-speaker-name">${speakerFullName}</div>
                                <div class="session_modal-speaker-company">${speakerTagline}</div>
                            </div>
                        </a>`;
            }).join('');
            modalSpeakersElement.html(speakerHtmls);
            addClickSpeakerTrigger();
            
        } else if (modalSpeakersElement.length) {
            modalSpeakersElement.html("").hide();
        }
        

        // modal.find('[data-element="location"]').text(session.roomId || '');

        const locationElement = modal.find('[data-element="location"]');

    if (locationElement.length && session.roomId) { 
        const room = allRooms.find(s => s.id === session.roomId); 
        const roomName = room ? room.name : 'Unknown Room'; 
        locationElement.text(roomName); 
    } else if (locationElement.length) {
        locationElement.hide();
    }

        

        // Populate categories in modal (Session format, Track, Level)
        const modalTypeElement = modal.find('[data-element="type"]');
        const modalAudienceElement = modal.find('[data-element="audience"]');
        const modalLevelElement = modal.find('[data-element="level"]');

        const modalTypeNames = [];
        const modalAudienceNames = [];
        const modalLevelNames = [];

        if (session.categoryItems && session.categoryItems.length > 0) {
            session.categoryItems.forEach(categoryId => {
                let foundCategory = null;
                let categoryGroupTitle = null;

                allCategories.some(group => {
                    if (group.items && Array.isArray(group.items)) {
                        foundCategory = group.items.find(item => item.id === categoryId);
                        if (foundCategory) {
                            categoryGroupTitle = group.title;
                            return true;
                        }
                    }
                    return false;
                });

                if (foundCategory && foundCategory.name) {
                    if (categoryGroupTitle === 'Session format') {
                        modalTypeNames.push(foundCategory.name);
                    } else if (categoryGroupTitle === 'Track') {
                        modalAudienceNames.push(foundCategory.name);
                    } else if (categoryGroupTitle === 'Level') {
                        modalLevelNames.push(foundCategory.name);
                    }
                }
            });
        }
        if (modalTypeElement.length) {
            modalTypeElement.text(modalTypeNames.join(', ') || '');
        }
        if (modalAudienceElement.length) {
            modalAudienceElement.text(modalAudienceNames.join(', ') || '');
        }
        if (modalLevelElement.length) {
            modalLevelElement.text(modalLevelNames.join(', ') || '');
        }

        // Populate other modal fields as needed (time, date, etc.)
        // Example for time:
        const modalTimeElement = modal.find('[data-element="time"]');
        if (modalTimeElement.length && session.startsAt) {
            const dateObj = new Date(session.startsAt);
            const startTime12hrFormat = dateObj.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
            if (session.endsAt) {
                 const endDateObj = new Date(session.endsAt);
                 const endTime12hrFormat = endDateObj.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                 modalTimeElement.text(`${startTime12hrFormat} - ${endTime12hrFormat}`);
            } else {
                 modalTimeElement.text(startTime12hrFormat);
            }
        }

    } else {
        console.warn(`Session with ID ${sessionId} not found for modal update.`);
    }
}

function updateSpeakerModal(speakerId, allSessions, allSpeakers, allCategories, allRooms) {
    console.log(`Updating modal for speaker ID: ${speakerId}`);

    // Find the specific session object based on the ID
    const speaker = allSpeakers.find(s => String(s.id) === String(speakerId));

    if (speaker) {
        console.log('Found speaker for modal:', speaker.fullName);

        const modal = $('.speaker_modal-modal'); 

        // Populate common modal elements
        modal.find('[data-element="speaker-name"]').text(speaker.fullName || ''); // Example for modal title
        modal.find('[data-element="speaker-title"]').text(speaker.tagLine || '')
        modal.find('[data-element="company-link"]').text(speaker.companyName || ' Company Name').attr('href','https://www.databricks.com/')
        modal.find('[data-element="speaker-bio "]').text(speaker.bio || '')
        modal.find('.speaker_modal-speaker img').attr('src', speaker.profilePicture).attr('srcset', speaker.profilePicture)



        //Create each social link element
        const speakerLinksElement = modal.find('.speaker_modal-social_links');
        if (speakerLinksElement.length && speaker.links && speaker.links.length > 0) {
            const speakerLinksHtmls = speaker.links.map(function(link){
                const linkContent = $(this);
                const linkUrl = link.url;
                const linkType = link.linkType;
                 return `<a href="${linkUrl}" target="_blank" class="speaker_modal-social_link">
                            ${linkType}
                        </a>`;
            }).join('');
            speakerLinksElement.html(speakerLinksHtmls);
            
        } else if (speakerLinksElement.length) {
            speakerLinksElement.html("").hide();
        }
        
const speakingAtElement = modal.find('.speaker_modal-sessions');

if (speakingAtElement.length && speaker.sessions && speaker.sessions.length > 0) {
    const sessionHtmls = speaker.sessions.map(sessionId => {
          const session = allSessions.find(s => s.id === String(sessionId));

        if (session) {
            const sessionID = session.id;
            const sessionTitle = session.title;

            // Parse dates and format them
            const startDate = new Date(session.startsAt);
            const endDate = new Date(session.endsAt);

            // Options for date and time formatting
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };

            const formattedDate = startDate.toLocaleDateString('en-US', dateOptions);
            const formattedStartTime = startDate.toLocaleTimeString('en-US', timeOptions);
            const formattedEndTime = endDate.toLocaleTimeString('en-US', timeOptions);

            const sessionDateTime = `${formattedDate} | ${formattedStartTime} - ${formattedEndTime}`;

            return `<div class="speaker_modal-session">
                        <a href="#session-${sessionID}" modal-trigger="session-modal">${sessionTitle}</a>
                        <div>${sessionDateTime}</div>
                    </div>`;
        } else {
            // Handle case where session is not found
            return `<div class="speaker_modal-session">
                        <p>No Sessions</p>
                    </div>`;
        }
    }).join(''); // Join all the generated HTML strings

    speakingAtElement.html(sessionHtmls);
    speakingAtElement.show(); // Ensure the element is visible

} else if (speakingAtElement.length) {
    speakingAtElement.html("").hide(); // Clear content and hide if no sessions
}
    
    } else {
        console.warn(`Session with ID ${sessionId} not found for modal update.`);
    }
}

function addClickSpeakerTrigger(){
        $('a[modal-trigger="speaker-modal"]').click(function(e){
        // e.preventDefault();
        $('.session_modal-modal')[0].close();
        console.log('Speaker Modal Trigger Clicked');
        const href = $(this).attr('href');
        console.log('clickedurl', href);
        const speakerId = $(this).attr('href').substring('#speaker-'.length);

        if (speakerId && globalSessionsData.length > 0) {
            $('.speaker_modal-modal')[0].showModal();
            updateSpeakerModal(speakerId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
        } else {
            console.warn('Cannot update modal: speaker ID or fetched data is missing.');
        }
    });
}