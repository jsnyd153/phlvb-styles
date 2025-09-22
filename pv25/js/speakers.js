$(document).ready(function() {

    gsap.registerPlugin(ScrollTrigger);
	// Declare variables in a higher scope to store fetched data
	// These will be populated once fetchSessionizeData() completes
	let globalSessionsData = [];
	let globalSpeakersData = [];
	let globalCategoriesData = [];
	let globalRoomsData = [];

    function fetchSessionizeData(){
        console.log('fetchSessionizeData: Function called.');
        // const url = 'https://sessionize.com/api/v2/jl4ktls0/view/All';
        const url = 'https://sessionize.com/api/v2/bokk47xg/view/All?preview=True';

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

function createSpeakerItem(speaker, allSessions, allSpeakers, allCategories, allRooms, templateElement) {
    const speakerItem = $(templateElement).clone();

    const nameEl = speakerItem.find('[ct-el="name"]');
    const headshotEl = speakerItem.find('[ct-el="headshot"]');
    const taglineEl = speakerItem.find('[ct-el="tagline"]');
    const linkEl = speakerItem.find('[ct-el="link"]');

    if (nameEl.length) {
        nameEl.text(speaker.fullName +'api' || '');
    }
    if (headshotEl.length) {
        headshotEl.attr('src', speaker.profilePicture || '').attr('srcset', speaker.profilePicture || '').attr('alt', speaker.fullName + 'headshot' || '');
    }
    if (taglineEl.length) {
        taglineEl.text(speaker.tagLine || '');
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
            console.log('cmsfilter callback: Sessions received from fetchSessionizeData:', allSpeakers.length, 'items.');

            if (allSpeakers.length === 0) {
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
            const newCmsItems = allSpeakers.map(function(speaker) {
                return createSpeakerItem(speaker, allSessions, allSpeakers, allCategories, allRooms, itemTemplateElement);
            });
            const rawNewCmsItems = newCmsItems.map(function($item) {
                return $item[0];
            });
            return listInstance.addItems(rawNewCmsItems);

        })
        .then(function() {
        addClickSpeakerTrigger();
        addClickSessionTrigger();
         addBrandHover()
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
            const sessionId = $(this).attr('href').substring('#session-'.length);
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