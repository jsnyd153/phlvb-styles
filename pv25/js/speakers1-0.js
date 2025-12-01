// Scope variables to just this build.
const speakerItems = $('.person-list-item');
speakerItems.css('opacity', '0');


let formattedSessionsData = [];
let categoriesData = [];
let formattedSpeakerData = [];
const baseUrl = getBaseUrl();

function getBaseUrl() {
  const currentUrl = window.location.href;
  const sessionsIndex = currentUrl.indexOf('/speakers');

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

    // Call the function and get the processed data
    fetchAndFormatSpeakers()
      .then(function(data) {

        const allSpeakers = data.speakers;
        console.log('cmsfilter callback: Formatted speakers received:', allSpeakers.length, 'items.');
        console.log(data)
            if (allSpeakers.length === 0) {
                console.warn('cmsfilter callback: No speakers to display. Clearing CMS list.');
                listInstance.clearItems();
                const noResultsMessage = $('<div>').text("No speakers are currently visible.");
                const listWrapper = $('.w-dyn-list');
                if (listWrapper.length) {
                    listWrapper.append(noResultsMessage);
                }
            return;
            }// if allSessions == 0

        // Create a mapping of session IDs to session objects for quick lookup
        const sessionMap = data.sessions.reduce((map, session) => {
            map[session.id] = session;
            return map;
        }, {});

        // Iterate through each speaker and replace the session IDs with the full session objects
            formattedSpeakerData = data.speakers.map(speaker => {
                const speakerSessions = speaker.sessions.map(sessionId => {
                // Use a Number() conversion to handle string vs. number keys
            return sessionMap[Number(sessionId)] || null;
            });

            // Return a new speaker object with the updated sessions array
            return { ...speaker,
            sessions: speakerSessions
            };
        });
        console.log(formattedSpeakerData);

        listInstance.clearItems();

        const newCmsItems = allSpeakers.map(function(speaker) {
          return createSpeakerItem(speaker, itemTemplateElement);
        });
        const rawNewCmsItems = newCmsItems.map(function(thisItem) {
          return thisItem[0];
        });
        return listInstance.addItems(rawNewCmsItems);

        })
      .then(function() {
        addClickSpeakerTrigger();
        addBrandHover();
        onLoadModal();
        // Animate the cards after they've been added to the DOM
        const newspeakerItems = $('.person-list-item');
        gsap.to(newspeakerItems, {
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.inOut"
        });
        gsap.to(newspeakerItems.find('a'), {
          opacity: 1,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.inOut"
        });
      })
      .catch(function(error) {
        console.error('Error during CMS update process:', error);
      });
  }
]);//window.fsAttributes.push


// Main Build functions

function createSpeakerItem(speaker, templateElement) {
    const speakerItem = $(templateElement).clone();

    const nameEl = speakerItem.find('[ct-el="name"]');
    const companyEl = speakerItem.find('[ct-el="company"]');
    const titleEl = speakerItem.find('[ct-el="tagline"]');
    const headshotEl = speakerItem.find('[ct-el="headshot"]');
    const linkEl = speakerItem.find('[ct-el="link"]');

    let personTitle;
    let personCompany;
    if (speaker.questionAnswers && speaker.questionAnswers.length > 0) {
        personTitle = speaker.questionAnswers[0].answerValue;
    } else {
        titleEl.css('opacity','0');
    }

    if (speaker.questionAnswers && speaker.questionAnswers.length > 1) {
        personCompany = speaker.questionAnswers[1].answerValue;
    } else {
        companyEl.css('opacity','0');
    }

    nameEl.text(speaker.fullName);
    companyEl.text(personCompany);
    titleEl.text(personTitle);
    headshotEl.attr('alt', speaker.fullName + ' headshot').attr('src',speaker.profilePicture);
    linkEl.attr('href', '#speaker-' + speaker.id || '')


    speakerItem.show();
    return speakerItem;

}// createSpeakerItem(session, templateElement)

function fetchAndFormatSpeakers() {
    console.log('fetchAndFormatSpeakers: Function called.');
    const dataSource = 'https://sessionize.com/api/v2/4wat9saa/view/All';

    return $.ajax({
        url: dataSource,
        method: 'GET',
        dataType: 'json'
    }).then(function(response) {
        console.log('fetchAndFormatSpeakers: JSON data parsed.');
        const sessions = response.sessions;
        const speakers = response.speakers;
        const categories = response.categories;
        const rooms = response.rooms;


        // This is a minimal, correct implementation to get the code running.
        // You can add your full formatting logic here later.
        return {
        //not sure if we really need these since we're storing the session and categories globally
        sessions: sessions,
        speakers: speakers,
        categories: categories,
        rooms: rooms
        };
    });
}//fetchandformatspeakers


//Interactions to add after cards are built
function addClickSpeakerTrigger() {
    $('a[modal-trigger="speaker-modal"]').click(function(e){
        $('dialog')[0].close(); //close any open dialogs
        const href = $(this).attr('href');
        // const sessionTypeString = $(this).attr('session-type');
        const speakerId = href.split('#speaker-').pop();
        updateSpeakerModal(speakerId);
        //open session modal
        $('.speaker_modal-modal').get(0).showModal();


    });//.click
}//addClickSessionTrigger()

function updateSpeakerModal(speakerId){
    console.log('updateModal ' + speakerId)
    
    const speaker = formattedSpeakerData.find(s => s.id === speakerId);
    
    if (speaker) {

        const companyAndTitleEl = $('[data-element="speaker-title"').parents('p');
        const nameEl = $('[data-element="speaker-name"]');
        const bioEl = $('[data-element="speaker-bio "]');;
        const sessionsTitleEl = $('[data-element="session-title"]');
        const sessionsTimeEl = $('[data-element="session-time"]');
        const socialLinksEl = $('[data-element="social-links"]');
        const headshotEl = $('[data-element="headshot"]');


        let companyLink = null;
        let socialLinksObjects = [];

    processSpeakerLinks(speaker)

    function processSpeakerLinks(speaker) {
    if (speaker && Array.isArray(speaker.links)) {
        speaker.links.forEach(link => {
        if (link.linkType === 'Company_Website') {
            //send company link to seperate variable
            companyLink = link.url;
        } else {
            const newLinkData = {
            text: link.title,
            href: link.url
            };
            const newLink = `<a href="${newLinkData.href}">${newLinkData.text}</a>`
            console.log(newLink)
            socialLinksObjects.push(newLink);
        }
        });
    }
    }//processSpeakerLinks()

    const socialHtml = socialLinksObjects.join(' ');

    let personTitle;
    let personCompany;
    if (speaker.questionAnswers && speaker.questionAnswers.length > 0) {
        personTitle = speaker.questionAnswers[0].answerValue;
    } else {
        titleEl.css('opacity','0');
    }
    if (speaker.questionAnswers && speaker.questionAnswers.length > 1) {
        personCompany = speaker.questionAnswers[1].answerValue;
    } else {
        companyEl.css('opacity','0');
    }
    let personName = speaker.fullName;
    
    let companyAndTitle;

    console.log(companyLink)
    if (companyLink != null){
        companyAndTitle = `<span data-element="speaker-title">${personTitle}</span>, <a href="${companyLink}" target="_blank" data-element="company-link">${personCompany}</a></p>`
    } else{
        companyAndTitle = `<span data-element="speaker-title">${personTitle}</span>, <span data-element="company-link">${personCompany}</a></p>`
    }

    let personBio;
    console.log(speaker.bio)
    if(speaker.bio){
        bioEl.show();
        personBio = speaker.bio;
    } else{
        bioEl.hide();
    }

    let sessionsTitle;
    let sessionsLink
    if (speaker.sessions && speaker.sessions.length > 0) {
        sessionsTitle = speaker.sessions[0].title;
        sessionsTitleEl.parents('.speaker_modal-details-row').show();
        sessionsLink = speaker.sessions[0].id;
    } else {
        sessionsTitleEl.parents('.speaker_modal-details-row').hide();
    }

    

    nameEl.text(personName);
    companyAndTitleEl.html(companyAndTitle);
    bioEl.html(personBio);
    sessionsTitleEl.text(sessionsTitle).attr('href', baseUrl+'/sessions/#session-'+sessionsLink);
    sessionsTimeEl.hide();
    socialLinksEl.html(socialHtml);
    headshotEl.attr('src',speaker.profilePicture).attr('srcset',speaker.profilePicture).attr('sizes','').attr('alt',speaker.fullName + 'headshot');


    } else {
        console.error('Session with ID ' + sessionId + ' not found.');
    }
}//updateSessionModal


function onLoadModal() {
const getCurrentSpeakerId = () => {
    const url = window.location.href;
    let speakerId = null;

    if (url.includes('#speaker-')){
         let textAfterHash = url.split('#speaker-')[1];
         if (textAfterHash.includes('/?')) {
            speakerId = textAfterHash.split('/?')[0];
        } else {
            speakerId = textAfterHash;
        }
    }
    return speakerId;
}

const speakerId = getCurrentSpeakerId();

    $('a[modal-trigger="speaker-modal"]').click(function(e){
        $('dialog')[0].close(); //close any open dialogs
        const href = $(this).attr('href');
        // const sessionTypeString = $(this).attr('session-type');
        const speakerId = href.split('#speaker-').pop();
        updateSpeakerModal(speakerId);
        //open session modal
        $('.speaker_modal-modal').get(0).showModal();


    });//.click


if (speakerId) {
  console.log('Session ID found:', speakerId);
  const targetSessionCard = $('[href="#speaker-'+ speakerId +'"]').each(function(){
        $('dialog')[0].close(); //close any open dialogs
        const href = $(this).attr('href');
        // const sessionTypeString = $(this).attr('session-type');
        const speakerId = href.split('#speaker-').pop();
        updateSpeakerModal(speakerId);
        //open session modal
        $('.speaker_modal-modal').get(0).showModal();
  })
} else {
  console.log('No session ID found in the URL.');
}


}//addClickSessionTrigger()

//=======================
//Base Modal Function
//=======================

    // Close functions
    // Also removes the session ID from the url
    $('[modal-trigger="close"], .speaker_modal-close').click(function(){
        $(this).parents('dialog')[0].close();
        history.replaceState(null, '', window.location.href.split('#')[0]);
    });
    // Close Modal on click off
    $(document).on('click', 'dialog', function(event) {
        if ($(event.target).is(this)) {
            $(this).get(0).close();
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



