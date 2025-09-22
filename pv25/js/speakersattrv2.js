$(document).ready(function() {
    	gsap.registerPlugin(ScrollTrigger);

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
		// const url = 'https://sessionize.com/api/v2/jl4ktls0/view/All';
		const url = 'https://sessionize.com/api/v2/bokk47xg/view/All?preview=True';
		return $.ajax({
			url: url,
			method: 'GET',
			dataType: 'json'
		}).done(function(jsonData) {
			//debug - check to make sure all the types of data are loading
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
			if (!jsonData.rooms || !Array.isArray(jsonData.rooms)) {
				console.warn('fetchSessionizeData: "rooms" property is not an array or does not exist.');
			}
		}).fail(function(jqXHR, textStatus, errorThrown) {
			//debug - throw error
			console.error('fetchSessionizeData: Error during AJAX fetch:', textStatus, errorThrown);
			return $.Deferred().reject({
				sessions: [],
				speakers: [],
				categories: [],
				rooms: []
			}).promise();
		}).then(function(jsonData) {
			// Populate the higher-scoped variables with the fetched data
			globalSessionsData = jsonData.sessions || [];
			globalSpeakersData = jsonData.speakers || [];
			globalCategoriesData = jsonData.categories || [];
			globalRoomsData = jsonData.rooms || [];
			return {
				sessions: globalSessionsData,
				speakers: globalSpeakersData,
				categories: globalCategoriesData,
				rooms: globalRoomsData
			};
		})
	} //fetchSessionizeData
	/**
	 * Creates a new CMS item element using jQuery.
	 * @param {object} session - The session data.
	 * @param {Array} allSessions - The session data.
	 * @param {object} speaker - The session data.
	 * @param {Array} allSpeakers - Array of all speakers.
	 * @param {Array} allCategories - Array of all categories.
	 * @param {HTMLElement} templateElement - The DOM element to clone for the new item.
	 * @returns {jQuery} The new jQuery-wrapped CMS item element.
	 **/
	function createCmsItem(speaker, allSessions, allSpeakers, allCategories, allRooms, templateElement) {
		const speakerItem = $(templateElement).clone();
		const nameEl = speakerItem.find('[ct-el="name"]');
		const headshotEl = speakerItem.find('[ct-el="headshot"]');
		const companyEl = speakerItem.find('[ct-el="company"]');
		const linkEl = speakerItem.find('[ct-el="link"]');
		if (nameEl.length) {
			nameEl.text(speaker.fullName +'api' || '');
		}
		if (headshotEl.length) {
			headshotEl.attr('src', speaker.profilePicture || '').attr('srcset', speaker.profilePicture || '').attr('alt', speaker.fullName + 'headshot' || '');
		}
		if (companyEl.length) {
			companyEl.text(speaker.tagLine || '');
		}
		if (linkEl.length) {
			linkEl.attr('href', '#speaker-' + speaker.id || '')
			if (speaker.id.length) {
				linkEl.attr('modal-trigger', 'speaker-modal');
			}
		}
		speakerItem.show();
		return speakerItem;
	}


function generateStaticCmsElements() {
    console.log('Generating static CMS elements...');

    // Assuming fetchSessionizeData() is defined elsewhere and returns a Promise
    fetchSessionizeData().then(function(data) {
        // data.sessions, data.speakers, data.categories, data.rooms are expected from fetchSessionizeData
        const allSessions = data.sessions;
        const allSpeakers = data.speakers;
        const allCategories = data.categories;
        const allRooms = data.rooms;

        const templateElement = $('.speaker_list-item:first');
        
        console.log(allSessions,allSpeakers,allCategories,allRooms)

        // Target the existing CMS list wrapper
        const listWrapper = $('[fs-list="list"]');
        if (listWrapper.length === 0) {
            console.error("generateStaticCmsElements: CMS list wrapper not found.");
            return;
        }

        // Clear any existing items in the CMS list (if any static content was there)
        listWrapper.empty();

        if (allSpeakers.length === 0) {
            console.warn('generateStaticCmsElements: No speakers to display.');
            const noResultsMessage = $('<div>').text("No speakers are currently scheduled.");
            listWrapper.append(noResultsMessage);
            return;
        }

        // Assuming createCmsItem is defined elsewhere
        // and generates a jQuery object representing a CMS item
        const newCmsItems = allSpeakers.map(function(speaker) {
            return createCmsItem(speaker, allSessions, allSpeakers, allCategories, allRooms, templateElement);
        });

        // Append the new CMS items to the list wrapper
        // newCmsItems are already jQuery objects, so append them directly
        newCmsItems.forEach(function($item) {
            listWrapper.append($item);
        });

        console.log('Static CMS list updated successfully.');

        // Add triggers and effects to the newly created elements
        // Assuming these functions are defined elsewhere
        addClickSpeakerTrigger();
        addClickSessionTrigger();
        // addCmsScrollEffects();
        onLoadModalCheck();
        // loadFinsweetAttributesScript() 
        

    }).catch(function(error) {
        console.error('generateStaticCmsElements: Error during CMS update process:', error);
        const $errorMessage = $('<div>').text("There was an error loading the sessions. Please try again later.");
        const $listWrapper = $('.w-dyn-list');
        if ($listWrapper.length) {
            $listWrapper.append($errorMessage);
        }
    });
}

// generateStaticCmsElements();
generateStaticCmsElements()


//===============Additional triggers



    function addClickSpeakerTrigger(){
        $('a[modal-trigger="session-modal"]').click(function(e){
            $('dialog')[0].close();
            const href = $(this).attr('href');
            console.log('Modal trigger clicked', href);
            const sessionId = $(this).attr('href').substring('#session-'.length);
            if (sessionId && globalSessionsData.length > 0) {
                updateSessionModal(sessionId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
            }
        });
    }

    function addClickSessionTrigger(){
            $('[modal-trigger="speaker-modal"]').click(function(e){
            $('dialog')[0].close();
            const href = $(this).attr('href');
            console.log('Speaker Modal Trigger Clicked', href);
            const speakerId = $(this).attr('href').substring('#speaker-'.length);
            if (speakerId && globalSessionsData.length > 0) {
                updateSpeakerModal(speakerId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
            }
        });
    }
    function addCmsScrollEffects(){
        $('[data-cmsfilter-name="sessions"] .content_grid').each(function() {
            let gridElement = $(this);
            let cardElement = $(this).find('.speaker_list-item');
            let cardElementImage = $(this).find('.speaker_list-item img');
            let cardCount = gridElement.find('.speaker_list-item').length;

            gsap.set(cardElementImage, {scale:1.5});
            var staggerIn = gsap.timeline({
                scrollTrigger: {
                    trigger: gridElement,
                    start: `top 100%`,
                    end: "bottom 100%",
                    scrub: true,
                    markers:true,
                }
            });
            staggerIn.from(cardElement, {
            opacity: 0,
            duration: 1,
            stagger:.1,
        })
        // Add the .to animation for the image (scale), starting at the same time
        .to(cardElementImage, {
            scale: 1, // Scales down to its original size
            duration: 1, // Duration of this animation
            stagger:.1,
        }, "<");

        });
    }

    // Close Modal on button Click
    $('[modal-trigger="close"]').click(function(){
        $(this).parents('dialog')[0].close();
        history.replaceState(null, '', window.location.href.split('#')[0]);
    });

    //Close Modal on Backgorund Click
    $(document).on('click', 'dialog', function(event) {
    // Check if the click occurred directly on the dialog element itself (the backdrop) and not on its content.
    if ($(event.target).is(this)) {
        $(this).get(0).close();
        history.replaceState(null, '', window.location.href.split('#')[0]);
    }
});


//===============Update Modal Content

function updateSessionModal(sessionId, allSessions, allSpeakers, allCategories, allRooms) {
    const session = allSessions.find(s => String(s.id) === String(sessionId));
        if (session) {
            
            console.log('Found session for modal:', session.title);
            const modal = $('.session_modal-modal'); 
            modal[0].showModal();

            modal.find('[data-element="session-title"]').text(session.title || '');
            modal.find('[data-element="description"]').text(session.description || '');


            //Find all corresponding spekaers and generate speakers list
            const modalSpeakersElement = modal.find('.session_modal-speakers');
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
            // replace all the spaker content
            modalSpeakersElement.html(speakerHtmls);
            // add click triggers to the newly created speakers
            addClickSpeakerTrigger();
            
        } else if (modalSpeakersElement.length) {
            modalSpeakersElement.html("").hide();
        }

    //Populate Room data
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
        

        //Set Time and date

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
        $('.speaker_modal-modal')[0].showModal();
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
                        <a href="#session-${sessionID}" modal-trigger="session-modal" />${sessionTitle}</a>
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



} else if (speakingAtElement.length) {
    speakingAtElement.html("").hide(); // Clear content and hide if no sessions
}
    
    } else {
        console.warn(`Speaker with ID ${speakerId} not found for modal update.`);
    }
}


                //Trigger modals based on url
                function onLoadModalCheck(){
                    const url = window.location.href;
                    const urlID = url.substring(url.indexOf("#") + 1);
                    console.log('urlID',urlID)

                    if (urlID.includes("session")) {
                         const sessionId =  urlID.substring('session-'.length);
                        updateSessionModal(sessionId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
                    } 
                    if (urlID.includes("speaker-")) {
                         const speakerId = urlID.substring('speaker-'.length);
                        updateSpeakerModal(speakerId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
                    }
                }

});


