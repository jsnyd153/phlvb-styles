$(document).ready(function() {


	// Declare variables in a higher scope to store fetched data
	// These will be populated once fetchSessionizeData() completes
	let globalSessionsData = [];
	let globalSpeakersData = [];
	let globalCategoriesData = [];
	let globalRoomsData = [];

    function fetchSessionizeData(){
        console.log('fetchSessionizeData: Function called.');
        // const url = 'https://sessionize.com/api/v2/jl4ktls0/view/All';
        const url = 'https://sessionize.com/api/v2/4wat9saa/view/All';

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
}//fetchSessionizeDaya()

function createSessionItem(session, allSessions, allSpeakers, allCategories, allRooms, templateElement) {
    const sessionItem = $(templateElement).clone();
    const gridSessionlinkElement = sessionItem.find('.event_card-card');
    const featureSessionlinkElement = sessionItem.find('.featured_event-card');

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
            endTime = dateObj.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
        let sortDate;
        let filterDate;
        if (session.startsAt) {
        const dateObj = new Date(session.startsAt);
            const year = dateObj.toLocaleString('en-US', { year: 'numeric' });
            const month = dateObj.toLocaleString('en-US', { month: 'long' });
            const monthShort = dateObj.toLocaleString('en-US', { month: 'short' });
            const day = dateObj.toLocaleString('en-US', { day: 'numeric' });
            const hour = dateObj.toLocaleString('en-US', { hour: 'numeric', hour12: false });
            const minute = dateObj.toLocaleString('en-US', { minute: '2-digit' });
            // session-sort-time: "September 16, 2023 9:00"
            sortDate = `${month} ${day}, ${year} ${hour}:${minute}`;
            filterDate = `${month} ${day}`;
        
        }
    //Seperate Categories
    //=============================

        const sessionTypeNames = [];
        const sessionAudienceNames = [];
        const sessionLevelNames = [];
        const sessionLanguageNames = [];
        const sessionIndustryNames = [];


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
                } else if (categoryGroupTitle === 'Target Audience') {
                    sessionAudienceNames.push(foundCategory.name);
                } else if (categoryGroupTitle === 'Industry') {
                    sessionIndustryNames.push(foundCategory.name);
                } else if (categoryGroupTitle === 'Level') {
                    sessionLevelNames.push(foundCategory.name);
                } else if (categoryGroupTitle === 'Language') {
                    sessionLanguageNames.push(foundCategory.name);
                }
            }
        });
    }

    //Audiences



const speakerTextNamesHtml = [];
    const speakerPictureNamesHtml = [];
        if (session.speakers && session.speakers.length > 0) {
        speakerNames = session.speakers.map(function(speakerId) {
            const speaker = allSpeakers.find(s => s.id === speakerId);
            
            const speakerFullName = speaker ? speaker.fullName : 'Unknown Speaker';
            const speakerTagline = speaker ? speaker.tagLine : 'Unknown Company';
            const speakerNamesHtml = `<span>${speakerFullName}, <span class="company">${speakerTagline}</span></span>`;

            const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
            speakerTextNamesHtml.push(speakerNamesHtml);
            
            const speakerPicturesHtml =  `<div class="featured_event-speaker"><img class="profile-picture" src="${speakerImage}" alt="${speakerFullName} headshot"><span>${speakerFullName}, <span class="company">${speakerTagline}</span></span></div>`;
            speakerPictureNamesHtml.push(speakerPicturesHtml);
        });
    }

     

    //populate fields for Grid View
    if(gridSessionlinkElement.length ){
        console.log('gridSessionlinkElement format' )
        gridSessionlinkElement.parents('a').attr('href', '#session-' + session.id || '').attr('session-type', sessionTypeNames[0]);
        
        const titleEl = gridSessionlinkElement.find('[ct-el="session-title"]');
        const startTimeEl = gridSessionlinkElement.find('[ct-el="session-start-time"]');
        const typeEl = gridSessionlinkElement.find('[ct-el="type"]');
        const speakerListEl = gridSessionlinkElement.find('[ct-el="speaker-list"]');
        const locationEl = gridSessionlinkElement.find('[ct-el="location"]');
        
        titleEl.text(session.title || '');
        locationEl.text(roomName || '');
        startTimeEl.text(startTime || '');
        typeEl.text(sessionTypeNames.join(', '));
        speakerListEl.html(speakerTextNamesHtml.join('/ '));
    }//gridSessionlinkElement

    if(featureSessionlinkElement.length ){
        console.log('featureSessionlinkElement format' )
        featureSessionlinkElement.parents('a').attr('href', '#session-' + session.id || '').attr('session-type', sessionTypeNames[0]);

        const titleEl = featureSessionlinkElement.find('[ct-el="session-title"]');
        const timeEl = featureSessionlinkElement.find('[ct-el="session-time-full"]');
        const typeEl = featureSessionlinkElement.find('[ct-el="type"]');
        const speakerListEl = featureSessionlinkElement.find('[ct-el="speaker-list"]');
        const locationEl = featureSessionlinkElement.find('[ct-el="location"]');
        const audienceEl = featureSessionlinkElement.find('[ct-el="audience"]');

        titleEl.text(session.title || '');

        if(roomName){
            locationEl.text(roomName || '');
        } else{
            locationEl.parents('.featured_event-details-row').hide();
        }
        if(startTime && endTime){
            timeEl.text(startTime + ' - ' + endTime || '');    
        } else if(startTime){
            timeEl.text(startTime || ''); 
        }
        else{
            timeEl.hide();
        }
        if (sessionTypeNames.length > 0){
            typeEl.text(sessionTypeNames.join(', '));
        } else{
            typeEl.hide();
        }
        if (sessionAudienceNames.length > 0){
            audienceEl.text(sessionAudienceNames.join(', '));
        } else {
            audienceEl.parents('.featured_event-details-row').hide();
        }
        if (speakerPictureNamesHtml.length > 0){
            speakerListEl.html(speakerPictureNamesHtml.join(''));
        } else {
            speakerListEl.parents('.featured_event-details-row').hide();
        }
        


    }//featureSessionlinkElement

    //Sort/Filter Data
    const metaElement = sessionItem.find('.meta');
    metaElement.find('[fs-cmsfilter-field="filter-date"]').text(filterDate);
    metaElement.find('[fs-cmsfilter-field="filter-level"]').text(sessionLevelNames.join(', '));
    metaElement.find('[fs-cmsfilter-field="filter-audience"]').text(sessionAudienceNames.join(', '));
    metaElement.find('[fs-cmsfilter-field="filter-type"]').text(sessionTypeNames.join(', '));
    metaElement.find('[fs-cmsfilter-field="sort-date"]').text(sortDate);
    metaElement.find('[fs-cmsfilter-field="search-description"]').text(session.description);
    metaElement.find('[fs-cmsfilter-field="search-name"]').text(session.title);

    sessionItem.show();
    return sessionItem;
}

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
            const allSessions = data.sessions;
            const allSpeakers = data.speakers;
            const allCategories = data.categories;
            const allRooms = data.rooms;
            console.log('cmsfilter callback: Sessions received from fetchSessionizeData:', allSessions.length, 'items.');

            if (allSessions.length === 0) {
                console.warn('cmsfilter callback: No sessions to display. Clearing CMS list.');
                    listInstance.clearItems();
                    const noResultsMessage = $('<div>').text("No speakers are currently scheduled.");
                    const listWrapper = $('.w-dyn-list');
                    if (listWrapper.length) {
                        listWrapper.append(noResultsMessage);
                    }
                    return; // Stop execution if no sessions
            }

            listInstance.clearItems();
            const newCmsItems = allSessions.map(function(session) {
                return createSessionItem(session, allSessions, allSpeakers, allCategories, allRooms, itemTemplateElement);
            });
            const rawNewCmsItems = newCmsItems.map(function($item) {
                return $item[0];
            });
            return listInstance.addItems(rawNewCmsItems);

        })
        .then(function() {
        addClickSpeakerTrigger();
        addClickSessionTrigger();
        addBrandHover();
        // onLoadModalCheck();
        })
        .catch(function(error) {
            console.error('cmsfilter callback: Error during CMS update process:', error);
            const errorMessage = $('<div>').text("There was an error loading the sessions. Please try again later.");
            const listWrapper = $('.w-dyn-list');
            if (listWrapper.length) {
                listWrapper.append(errorMessage);
            }
        });

    }
])

    function addClickSpeakerTrigger(){
        $('a[modal-trigger="speaker-modal"]').click(function(e){
            $('dialog')[0].close();
            const href = $(this).attr('href');
            console.log('Modal trigger clicked', href);
            const speakerId = $(this).attr('href').substring('#speaker-'.length);
            if (speakerId && globalSessionsData.length > 0) {
                updateSpeakerModal(speakerId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
            }
        });
    }

    function addClickSessionTrigger(){
        $('a[modal-trigger="session-modal"]').click(function(e){
            $('dialog')[0].close();
            const href = $(this).attr('href');
            console.log('Modal trigger clicked', href);
            const sessionId = $(this).attr('href').substring('#session-').length;
            if (sessionId && globalSessionsData.length > 0) {
                updateSessionModal(sessionId, globalSessionsData, globalSpeakersData, globalCategoriesData, globalRoomsData);
            }
        });
    }

    function updateSessionModal(sessionId, allSessions, allSpeakers, allCategories, allRooms) {
        console.log(`Updating modal for session ID: ${sessionId}`);
    }
    function updateSpeakerModal(speakerId, allSessions, allSpeakers, allCategories, allRooms) {
        console.log(`Updating modal for speaker ID: ${speakerId}`);
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
})

});

$('#Featured-Events, #Oct-29').attr('checked','');

  $('.dropdown--button[action="toggle-dropdown"]').each(function() {
    $(this).click(function() {

        $(this).parents('.fs-filter-dropdown').toggleClass('open');
    })
});


function createSessionTypeFilters(sessionTypes) {
    const filterContainer = $('<div class="dropdown--container"></div>');
    const filterList = $('<div class="dropdown--list"></div>');

    sessionTypes.forEach(function(type) {
        // Sanitize the type name for use in IDs and data attributes
        const sanitizedName = type.toLowerCase().replace(/\s/g, '-');

        const multiSelectInput = $('<div class="multi-select-input"></div>');
        const label = $(`<label class="w-checkbox checkbox-group-item fs-cmsfilter_active"></label>`);
        const input = $(`<input type="checkbox" name="${sanitizedName}" id="${sanitizedName}" data-name="${type}" class="w-checkbox-input" checked="">`);
        const checkboxDisplay = $('<div class="checkbox-display"></div>');
        const span = $(`<span fs-cmsfilter-field="session-type" class="w-form-label" for="${sanitizedName}"></span>`).text(type);

        label.append(input, checkboxDisplay, span);
        multiSelectInput.append(label);
        filterList.append(multiSelectInput);
    });

    filterContainer.append(filterList);
    return filterContainer;
}

// Function call to create the HTML and append it to the #audience-dropdown element
const sessionTypes = ['keynote', 'lightning talks', 'session', 'workshop'];
const filtersHtml = createSessionTypeFilters(sessionTypes);
$('#audience-dropdown').append(filtersHtml);