//Scope variables to just this build. Wait till page loaded


//Initially session items
const sessionItems = $('.session_list-item');
sessionItems.css('opacity', '0')

//Store Global Data
let formattedSessionsData = [];
let categoriesData = [];
let formattedSpeakerData = [];


const baseUrl = getBaseUrl();

function getBaseUrl() {
  const currentUrl = window.location.href;
  const sessionsIndex = currentUrl.indexOf('/sessions');

  if (sessionsIndex !== -1) {
    return currentUrl.substring(0, sessionsIndex);
  } else {
    return currentUrl;
  }
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

        fetchAndFormatSessions()
        .then(function(data) {
             const allSessions = data.sessions;
             console.log('cmsfilter callback: Formatted sessions received:', allSessions.length, 'items.');
             console.log(data)
            if (allSessions.length === 0) {
                console.warn('cmsfilter callback: No sessions to display. Clearing CMS list.');
                listInstance.clearItems();
                const noResultsMessage = $('<div>').text("No sessions are currently scheduled.");
                const listWrapper = $('.w-dyn-list');
                if (listWrapper.length) {
                    listWrapper.append(noResultsMessage);
                }
            return;
            }// if allSessions == 0

        //Clear items
        listInstance.clearItems();

        const newCmsItems = allSessions.map(function(session) {
          return createSessionItem(session, itemTemplateElement);
        });
        const rawNewCmsItems = newCmsItems.map(function(thisItem) {
          return thisItem[0];
        });
        return listInstance.addItems(rawNewCmsItems);
        })//fetchAndFormatSessions().then > uses data to build + update cards
        .then(function(){
            //Add triggers to the cards affter build
            addClickSessionTrigger();
            addCardHover();
            onLoadModal();
            //aniamte the cards back in now that they have data
            const sessionItems = $('.session_list-item');
            gsap.to(sessionItems, {
                opacity: 1,
                duration: 0.5, // The duration of each individual item's animation
                stagger: 0.15, // The delay between the start of each item's animation
                ease: "power2.inOut" // A smooth easing function
            });
        })//fetchAndFormatSessions().then.then > add interations to cards
    }

])//window.fsAttributes.push

//Main Build functions
function createSessionItem(session, templateElement) {

    const sessionItem = $(templateElement).clone();

    //=============================
    //Get and Format all the Data
    //=============================


    // Get Room Name
    let roomName;
    if (session.roomId) { 
        const room = allRooms.find(s => s.id === session.roomId); 
        roomName = room ? room.name : 'Unknown Room'; 
    } 

    // Get and format Speaker Data
    const speakerTextNamesHtml = []; // html object for the grid cards (pure text)
    const speakerPictureNamesHtml = []; // html object for feature cards (with headshots)

    if (session.speakers && session.speakers.length > 0) {
        session.speakers.forEach(function(speaker) {
            const speakerFullName = speaker ? speaker.fullName : 'Speaker TBA';

            const companyAnswer = speaker.questionAnswers.find(qa => qa.questionId === 101997);
            const speakerCompany = companyAnswer ? companyAnswer.answerValue : '';
            const speakerNamesHtml = `<span>${speakerFullName}, <span class="company">${speakerCompany}</span></span>`;
            
            const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
            speakerTextNamesHtml.push(speakerNamesHtml);
            
            const speakerPicturesHtml = `<div class="featured_event-speaker"><img class="profile-picture" src="${speakerImage}" alt="${speakerFullName} headshot"><span>${speakerFullName}, <span class="company">${speakerCompany}</span></span></div>`;
            speakerPictureNamesHtml.push(speakerPicturesHtml);
        });
    }

    // New logic to format the categories
    let sessionTypeName = getCategoryNamesByTitle(session.categoryItems, 'Session format');
    let sessionLevelName = getCategoryNamesByTitle(session.categoryItems, 'Level');

    function getCategoryNamesByTitle(categoryItems, title) {
        const category = categoryItems.find(c => c.title === title);
        if (category) {
            return category.items.map(item => {
                // removes content in "()" -> sanitizes the session type
                return item.name.replace(/\s*\(.*\)/, '').trim();
            });
        }
        return [];
    }//getCategoryNamesByTitle

    let sessionAudienceNames = getCategoryNamesByTitleMultivalue(session.categoryItems, 'Target Audience', 'filter-audience');

    function getCategoryNamesByTitleMultivalue(categoryItems, title, filterName) {
        const category = categoryItems.find(c => c.title === title);
        if (category) {
            // removes content in "()" -> sanitizes the session type
            return category.items.map(item => {
                const name = item.name.replace(/\s*\(.*\)/, '').trim();
                return `<span fs-cmsfilter-field="${filterName}">${name}</span>`;
            }).join(''); 
        }
        return '';
    }//getCategoryNamesByTitleMultivalue

    // Format Dates
    //Format Start Time
    let startTime;
        if (session.startsAt) {
        const dateObj = new Date(session.startsAt);
        startTime = dateObj.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }  else {
        //if there's no actual time, set the time value the session length
        let sessionLength;
        if (sessionTypeName == 'Lightning Talk'){
            sessionLength = 15;
        }
        if (sessionTypeName == 'Breakout Session'){
            sessionLength = 45;
        }
        if (sessionTypeName == 'Keynote'){
            sessionLength = 90;
        }
        if (sessionTypeName == 'Training'){
            sessionLength = 30;
        }
        startTime = sessionLength + 'min';
    }
     //Format Start Time
    let endTime;
    if (session.endsAt) {
        const dateObj = new Date(session.endsAt);
        endTime = dateObj.toLocaleString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
    //format start. time for filters/sorting
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
            
            sortDate = `${month} ${day}, ${year} ${hour}:${minute}`; // format for chronological sort
            filterDate = `${month} ${day}`; // format for date filter
        }

        //Modify the temaplte item with the new data

        const gridSessionElement = sessionItem.find('.event_card-card');
        gridSessionElement.parents('a').attr('href', '#session-' + session.id || '').attr('session-type', sessionTypeName[0]);
        gridSessionElement.find('[ct-el="session-title"]').text(session.title || '');
        gridSessionElement.find('[ct-el="session-start-time"]').text(startTime || '');
        gridSessionElement.find('[ct-el="type"]').text(sessionTypeName);
        gridSessionElement.find('[ct-el="speaker-list"]').html(speakerTextNamesHtml.join('/ '));
        gridSessionElement.find('[ct-el="location"]').text(roomName || '');



        const metaElement = sessionItem.find('.meta');
        metaElement.find('[fs-cmsfilter-field="filter-date"]').text(filterDate);
        metaElement.find('[fs-cmsfilter-field="filter-level"]').text(sessionLevelName.join(', '));
        metaElement.find('[fs-cmsfilter-field="filter-audience"]').html(sessionAudienceNames);
        metaElement.find('[fs-cmsfilter-field="filter-type"]').text(sessionTypeName);
        metaElement.find('[fs-cmsfilter-field="sort-date"]').text(sortDate);
        metaElement.find('[fs-cmsfilter-field="search-description"]').text(session.description);
        metaElement.find('[fs-cmsfilter-field="search-name"]').text(session.title);

    sessionItem.show();
    return sessionItem;
}// createSessionItem(session, templateElement)

function fetchAndFormatSessions() {

    console.log('fetchAndFormatSessions: Function called.');
    const dataSource = 'https://sessionize.com/api/v2/4wat9saa/view/All';

    return $.ajax({
        url: dataSource,
        method: 'GET',
        dataType: 'json'
    }) .then(function(response){
        console.log('fetchAndFormatSessions: JSON data parsed.');
        const sessions = response.sessions;
        const speakers = response.speakers;
        const categories = response.categories;
        const rooms = response.rooms;

        categoriesData = categories;

    const newFormattedData = sessions.map(session => {
      // Find and replace speaker IDs with full speaker objects
      session.speakers = session.speakers.map(speakerId => {
        return speakers.find(speaker => speaker.id === speakerId);
      });

      // Correctly build the new `categoryItems` array
      const newCategoryItems = categories.map(category => {
        const matchingItems = category.items.filter(item => session.categoryItems.includes(item.id));
        if (matchingItems.length > 0) {
          return {
            id: category.id,
            title: category.title,
            items: matchingItems,
            sort: category.sort,
            type: category.type
          };
        }
      }).filter(Boolean); // Filters out any categories that had no matching items

            // build categories into the session data by replacing .categoryItems
            session.categoryItems = newCategoryItems;

            //Return modified session with categories and speakers already mapped
            return session;
        });
        console.log("Data fetched and formatted successfully. ✅");
        // Store new version fo the sessions globally 
        formattedSessionsData = newFormattedData; 
        console.log(formattedSessionsData)

        return {
        //not sure if we really need these since we're storing the session and categories globally
        sessions: formattedSessionsData,
        speakers: speakers,
        categories: categories,
        rooms: rooms
        };
    });//.then(function(responce)
}//fetchAndFormatSessions()


//Interactions to add after cards are built
function addClickSessionTrigger() {
    $('a[modal-trigger="session-modal"]').click(function(e){
        $('dialog')[0].close(); //close any open dialogs
        const href = $(this).attr('href');
        const sessionTypeString = $(this).attr('session-type');
        const sessionId = href.split('#session-').pop();
        updateSessionModal(sessionId, sessionTypeString);
        //open session modal
        $('.session_modal-modal').get(0).showModal();
    });//.click
}//addClickSessionTrigger()

function onLoadModal() {
const getCurrentSessionId = () => {
    const url = window.location.href;
    let sessionId = null;

    if (url.includes('#session-')){
         let textAfterHash = url.split('#session-')[1];
         if (textAfterHash.includes('/?')) {
            sessionId = textAfterHash.split('/?')[0];
        } else {
            sessionId = textAfterHash;
        }
    }
    return sessionId;
}

const sessionId = getCurrentSessionId();

if (sessionId) {
  console.log('Session ID found:', sessionId);
  const targetSessionCard = $('[href="#session-'+ sessionId +'"]').each(function(){
    $('dialog')[0].close();
    const href = $(this).attr('href');
    const sessionTypeString = $(this).attr('session-type');
    const sessionId = href.split('#session-').pop();
    updateSessionModal(sessionId, sessionTypeString);
    //open session modal
    $('.session_modal-modal').get(0).showModal();
  })
} else {
  console.log('No session ID found in the URL.');
}


}//addClickSessionTrigger()

function addCardHover() {
	const brandHoverCards = $('.session_list-item');
	if (brandHoverCards.length > 0) {
		brandHoverCards.each(function() {
			const thisItem = $(this); // Cache the jQuery object for the current item
            const colorSetting = thisItem.find('[ct-el="session-link"').attr('session-type');
            let colors = []; 
            if (colorSetting == 'Lightning Talk'){
                colors = ['rgb(84, 80, 224)', 'rgb(114, 176, 254)','rgb(84, 80, 224)'];
            }
            if(colorSetting == 'Breakout Session'){
                colors = ['rgba(254, 162, 55, 1)', 'rgba(245, 194, 127, 1)', 'rgba(254, 162, 55, 1)'];
            }
            if(colorSetting == 'Keynote'){
                colors = ['rgba(246, 63, 92, 1)', 'rgba(250, 141, 90, 1)', 'rgba(246, 63, 92, 1)'];
            }
            if(colorSetting == 'Training'){
                colors = ['rgba(126, 44, 191, 1)', 'rgba(183, 116, 243, 1)', 'rgba(126, 44, 191, 1)'];
            }

	
			thisItem.on('mouseenter', function() {
				gsap.killTweensOf(this);
				gsap.to(this, {
					duration: 0.5,
					'--_gold': colors[0],
					'--_red': colors[1],
					'--_blue': colors[2],
					'--_logo-opacity': '1',
					'--_glow-opacity': '1',
					ease: "power4.out"
				});
				// Attach mouseleave event listener for hover-out animation
				thisItem.on('mouseleave', function() {
					gsap.killTweensOf(this);
					gsap.to(this, {
						duration: 2,
						delay: .1,
						'--_gold': initialGoldColor,
						'--_red': initialGoldColor,
						'--_blue': initialGoldColor,
						'--_logo-opacity': '.9',
						'--_glow-opacity': '0',
						ease: "power4.out"
					});
				});
			});
		})
	}
} //addCardHover

function updateSessionModal(sessionId, sessionTypeString){
    console.log('updateModal ' + sessionId)
    const session = formattedSessionsData.find(s => s.id === sessionId);
    if (session) {
    // Build the HTML for all speakers in the session
    const speakerElementsHtml = session.speakers.map(speaker => {
    // Create the HTML string for a single speaker element
    const speakerFullName = speaker ? speaker.fullName : 'Unknown Speaker';
    const companyAnswer = speaker.questionAnswers.find(qa => qa.questionId === 101997);
    const speakerCompany = companyAnswer ? companyAnswer.answerValue : 'Unknown Company';
    const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
    const speakerId = speaker ? speaker.id : '';

    return `
    <a href="${baseUrl}/speakers/#speaker-${speakerId}" class="session_modal-speaker w-inline-block">
        <img src="${speakerImage}" alt="${speakerFullName} Headshot">
        <div class="session_modal-speaker-text">
        <div class="tag session_modal-speaker-name">${speakerFullName}</div>
        <div class="session_modal-speaker-company">${speakerCompany}</div>
        </div>
    </a>
    `;
}).join(''); // Join the array of HTML strings into a single string

// Replace the content of the .session_modal-speakers element with the new speaker elements
$('.session_modal-speakers').empty().append(speakerElementsHtml);

        const sessionTitle = session.title;
        let sessionDescriptionRaw;
        if(session.description){
         sessionDescriptionRaw = session.description;   
        } else {
             sessionDescriptionRaw = "";  
        }
        const sessionDescriptionLinked =  parseMarkdownLinks(sessionDescriptionRaw);
        const sessionDescription = parseLineBreaks(sessionDescriptionLinked);
        const sessionsSartTime = session.startsAt;
        const sessionsRoom = session.roomId;
        
        $('[data-element="type"]').text(sessionTypeString);
        $('.session_modal-content').attr('session-type', sessionTypeString);
        $('[data-element="session-title"]').text(sessionTitle)
        if(sessionsSartTime){
                $('[data-element="session-title"]').text(sessionsSartTime)
        } else{
            $('[data-element="date"]').css('display','none');
        }
        if(sessionsSartTime){
                $('[data-element="time"]').text(sessionsSartTime);
        } else{
            $('[data-element="time"]').text('min').addClass('session-length');
        }
        $('[data-element="description"]').html(sessionDescription);
        if(sessionsRoom){
            $('[data-element="location"]').html(sessionsRoom);
        }else{
            $('[data-element="location"]').parents('.session_modal-details-row').css('display','none');
        }

        updateCategoryInfo(session, 'Level', '[data-element="level"]');
        updateCategoryInfo(session, 'Target Audience', '[data-element="audience"]');
        updateCategoryInfo(session, 'Track', '[data-element="track"]');

    } else {
        console.error('Session with ID ' + sessionId + ' not found.');
        // Handle case where session is not found
        $('[data-element="type"]').text('Session not found');
    }
}//updateSessionModal

function updateCategoryInfo(session, categoryTitle, dataElementSelector) {
    const category = session.categoryItems.find(c => c.title === categoryTitle);
    
    if (category) {
        const names = category.items.map(item => item.name).join(', ');
        if (names) {
            $(dataElementSelector).html(names);
        } else {
            $(dataElementSelector).parents('.session_modal-details-row').css('display', 'none');
        }
    } else {
        $(dataElementSelector).parents('.session_modal-details-row').css
        ('display', 'none');
    }
}//updateCategoryInfo

function parseMarkdownLinks(text) {
    const regex = /\[(.*?)\]\((.*?)\)/g;
    return text.replace(regex, '<a href="$2" target="_blank">$1</a>');
}//parseMarkdownLinks

function parseLineBreaks(text) {
    if (typeof text !== 'string' || !text) {
        return '';
    }
    // Replace all occurrences of \r\n with the HTML <br> tag
    return text.replace(/\r\n/g, '<br>');
}//parseLineBreaks

//=======================
//Base Modal Function
//=======================

    // Close functions
    // Also removes the session ID from the url
    $('[modal-trigger="close"], .session_modal-close').click(function(){
        $('dialog').each(function() {
        if (typeof this.close === 'function') {
            this.close();
        }
    });
        history.replaceState(null, '', window.location.href.split('#')[0]);
    });
    // Close Modal on click off
    $(document).on('click', 'dialog', function(event) {
        if ($(event.target).is(this)) {
               $('dialog').each(function() {
        if (typeof this.close === 'function') {
            this.close();
        }
    });
            history.replaceState(null, '', window.location.href.split('#')[0]);
        }
    });

//=======================
//Dropdown Functions
//=======================

    $('[action="toggle-dropdown"').each(function() {
        $(this).click(function() {
            $(this).parent().toggleClass('open');
        })
    });
    $('.dropdown--container').each(function(){
    const items = $(this).find('.multi-select-input').length;
    $(this).css('--_items',items);
})



