let formattedSessionsData = [];
let categoriesData = [];
const sessionItems = $('.session_list-item');
sessionItems.css('opacity', '0')

function createSessionItem(session, templateElement) {
	const sessionItem = $(templateElement).clone();
	const gridSessionlinkElement = sessionItem.find('.event_card-card');
	const featureSessionlinkElement = sessionItem.find('.featured_event-card');
	let roomName;
	if (session.roomId) {
		const room = allRooms.find(s => s.id === session.roomId);
		roomName = room ? room.name : 'Unknown Room';
	}
	let startTime;
	if (session.startsAt) {
		const dateObj = new Date(session.startsAt);
		startTime = dateObj.toLocaleString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	} else {
		startTime = 'min';
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
		const year = dateObj.toLocaleString('en-US', {
			year: 'numeric'
		});
		const month = dateObj.toLocaleString('en-US', {
			month: 'long'
		});
		const monthShort = dateObj.toLocaleString('en-US', {
			month: 'short'
		});
		const day = dateObj.toLocaleString('en-US', {
			day: 'numeric'
		});
		const hour = dateObj.toLocaleString('en-US', {
			hour: 'numeric',
			hour12: false
		});
		const minute = dateObj.toLocaleString('en-US', {
			minute: '2-digit'
		});
		sortDate = `${month} ${day}, ${year} ${hour}:${minute}`;
		filterDate = `${month} ${day}`;
	}
	const speakerTextNamesHtml = [];
	const speakerPictureNamesHtml = [];
	if (session.speakers && session.speakers.length > 0) {
		session.speakers.forEach(function(speaker) {
			const speakerFullName = speaker ? speaker.fullName : 'Unknown Speaker';
			const companyAnswer = speaker.questionAnswers.find(qa => qa.questionId === 101997);
			const speakerCompany = companyAnswer ? companyAnswer.answerValue : 'Unknown Company';
			const speakerNamesHtml = `<span>${speakerFullName}, <span class="company">${speakerCompany}</span></span>`;
			const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
			speakerTextNamesHtml.push(speakerNamesHtml);
			const speakerPicturesHtml = `<div class="featured_event-speaker"><img class="profile-picture" src="${speakerImage}" alt="${speakerFullName} headshot"><span>${speakerFullName}, <span class="company">${speakerCompany}</span></span></div>`;
			speakerPictureNamesHtml.push(speakerPicturesHtml);
		});
	}
	let sessionTypeNames = getCategoryNamesByTitle(session.categoryItems, 'Session format');
	let sessionAudienceNames = getCategoryNamesByTitleMultivalue(session.categoryItems, 'Target Audience', 'filter-audience');
	let sessionLevelNames = getCategoryNamesByTitle(session.categoryItems, 'Level');
	if (gridSessionlinkElement.length) {
		gridSessionlinkElement.parents('a').attr('href', '#session-' + session.id || '').attr('session-type', sessionTypeNames[0]);
		const titleEl = gridSessionlinkElement.find('[ct-el="session-title"]');
		const startTimeEl = gridSessionlinkElement.find('[ct-el="session-start-time"]');
		const typeEl = gridSessionlinkElement.find('[ct-el="type"]');
		const speakerListEl = gridSessionlinkElement.find('[ct-el="speaker-list"]');
		const locationEl = gridSessionlinkElement.find('[ct-el="location"]');
		titleEl.text(session.title || '');
		locationEl.text(roomName || '');
		startTimeEl.text(startTime || '');
		typeEl.text(sessionTypeNames);
		speakerListEl.html(speakerTextNamesHtml.join('/ '));
	}
	if (featureSessionlinkElement.length) {
		featureSessionlinkElement.parents('a').attr('href', '#session-' + session.id || '').attr('session-type', sessionTypeNames[0]);
		const titleEl = featureSessionlinkElement.find('[ct-el="session-title"]');
		const timeEl = featureSessionlinkElement.find('[ct-el="session-time-full"]');
		const typeEl = featureSessionlinkElement.find('[ct-el="type"]');
		const speakerListEl = featureSessionlinkElement.find('[ct-el="speaker-list"]');
		const locationEl = featureSessionlinkElement.find('[ct-el="location"]');
		const audienceEl = featureSessionlinkElement.find('[ct-el="audience"]');
		titleEl.text(session.title || '');
		if (roomName) {
			locationEl.text(roomName || '');
		} else {
			locationEl.parents('.featured_event-details-row').hide();
		}
		if (startTime && endTime) {
			timeEl.text(startTime + ' - ' + endTime || '');
		} else if (startTime) {
			timeEl.text(startTime || '');
		} else {
			timeEl.hide();
		}
		if (sessionTypeNames.length > 0) {
			typeEl.text(sessionTypeNames);
		} else {
			typeEl.hide();
		}
		if (sessionAudienceNames.length > 0) {
			audienceEl.html(sessionAudienceNames);
		} else {
			audienceEl.parents('.featured_event-details-row').hide();
		}
		if (speakerPictureNamesHtml.length > 0) {
			speakerListEl.html(speakerPictureNamesHtml.join(''));
		} else {
			speakerListEl.parents('.featured_event-details-row').hide();
		}
	}
	const metaElement = sessionItem.find('.meta');
	metaElement.find('[fs-cmsfilter-field="filter-date"]').text(filterDate);
	metaElement.find('[fs-cmsfilter-field="filter-level"]').text(sessionLevelNames.join(', '));
	metaElement.find('[fs-cmsfilter-field="filter-audience"]').html(sessionAudienceNames);
	metaElement.find('[fs-cmsfilter-field="filter-type"]').text(sessionTypeNames);
	metaElement.find('[fs-cmsfilter-field="sort-date"]').text(sortDate);
	metaElement.find('[fs-cmsfilter-field="search-description"]').text(session.description);
	metaElement.find('[fs-cmsfilter-field="search-name"]').text(session.title);
	sessionItem.show();
	return sessionItem;

	function getCategoryNamesByTitle(categoryItems, title) {
		const category = categoryItems.find(c => c.title === title);
		if (category) {
			return category.items.map(item => {
				return item.name.replace(/\s*\(.*\)/, '').trim();
			});
		}
		return [];
	}

	function getCategoryNamesByTitleMultivalue(categoryItems, title, filterName) {
		const category = categoryItems.find(c => c.title === title);
		if (category) {
			return category.items.map(item => {
				const name = item.name.replace(/\s*\(.*\)/, '').trim();
				return `<span fs-cmsfilter-field="${filterName}">${name}</span>`;
			}).join('');
		}
		return '';
	}
}

function fetchAndFormatSessions() {
	const url = 'https://sessionize.com/api/v2/4wat9saa/view/All';
	return $.ajax({
		url: url,
		method: 'GET',
		dataType: 'json'
	}).then(function(response) {
		const sessions = response.sessions;
		const speakers = response.speakers;
		const categories = response.categories;
		const rooms = response.rooms;
		categoriesData = categories;
		const newFormattedData = sessions.map(session => {
			session.speakers = session.speakers.map(speakerId => {
				return speakers.find(speaker => speaker.id === speakerId);
			});
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
			}).filter(Boolean);
			session.categoryItems = newCategoryItems;
			return session;
		});
		console.log("Data fetched and formatted successfully. ✅");
		formattedSessionsData = newFormattedData;
		return {
			sessions: formattedSessionsData,
			speakers: speakers,
			categories: categories,
			rooms: rooms
		};
	});
}
window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push(['cmsfilter',
	function(filterInstances) {
		if (!filterInstances || filterInstances.length === 0) {
			console.error("cmsfilter callback: filterInstances array is empty or undefined. Is your F'inSweet CMS Filter setup correct on the page?");
			return;
		}
		const filterInstance = filterInstances[0];
		if (!filterInstance) {
			console.error("cmsfilter callback: The first filterInstance is undefined. This is unexpected.");
			return;
		}
		const {
			listInstance
		} = filterInstance;
		const [firstItem] = listInstance.items;
		const itemTemplateElement = firstItem.element;
		fetchAndFormatSessions().then(function(data) {
			const allSessions = data.sessions;
			if (allSessions.length === 0) {
				console.warn('cmsfilter callback: No sessions to display. Clearing CMS list.');
				listInstance.clearItems();
				const noResultsMessage = $('<div>').text("No sessions are currently scheduled.");
				const listWrapper = $('.w-dyn-list');
				if (listWrapper.length) {
					listWrapper.append(noResultsMessage);
				}
				return;
			}
			listInstance.clearItems();
			const newCmsItems = allSessions.map(function(session) {
				return createSessionItem(session, itemTemplateElement);
			});
			const rawNewCmsItems = newCmsItems.map(function($item) {
				return $item[0];
			});
			return listInstance.addItems(rawNewCmsItems);
		}).then(function() {
			$('.dropdown--container').each(function() {
				const items = $(this).find('.multi-select-input').length;
				$(this).css('--_items', items);
			})
			addClickSessionTrigger();
			const sessionItems = $('.session_list-item');
			gsap.to(sessionItems, {
				opacity: 1,
				duration: 0.5,
				stagger: 0.15,
				ease: "power2.inOut"
			});
		}).catch(function(error) {
			console.error('cmsfilter callback: Error during CMS update process:', error);
			const errorMessage = $('<div>').text("There was an error loading the sessions. Please try again later.");
			const listWrapper = $('.w-dyn-list');
			if (listWrapper.length) {
				listWrapper.append(errorMessage);
			}
		});
	}
])

function createCategoryFilters(categoryTitle, categoryFilterName) {
	const filterContainer = $('<div class="dropdown--container"></div>');
	const filterList = $('<div class="dropdown--list" color-theme="light"></div>');
	const targetCategory = categoriesData.find(cat => cat.title === categoryTitle);
	if (targetCategory && targetCategory.items) {
		targetCategory.items.forEach(function(item) {
			const nameWithoutParentheses = item.name.replace(/\s*\(.*\)/, '').trim();
			const sanitizedName = nameWithoutParentheses.toLowerCase().replace(/\s/g, '-');
			const multiSelectInput = $('<div class="multi-select-input"></div>');
			const label = $(`<label class="w-checkbox checkbox-group-item fs-cmsfilter_active"></label>`);
			const input = $(`<input type="checkbox" name="${sanitizedName}" id="${sanitizedName}" data-name="${nameWithoutParentheses}" class="w-checkbox-input" checked="">`);
			const checkboxDisplay = $('<div class="checkbox-display"></div>');
			const span = $(`<span fs-cmsfilter-field="${categoryFilterName}" class="w-form-label" for="${sanitizedName}"></span>`).text(nameWithoutParentheses);
			label.append(input, checkboxDisplay, span);
			multiSelectInput.append(label);
			filterList.append(multiSelectInput);
		});
	}
	filterContainer.append(filterList);
	return filterContainer;
}

function addClickSessionTrigger() {
	$('a[modal-trigger="session-modal"]').click(function(e) {
		$('dialog')[0].close();
		const href = $(this).attr('href');
		const sessionTypeString = $(this).attr('session-type');
		$('.session_modal-modal').get(0).showModal();
		const sessionId = href.split('#session-').pop();
		updateSessionModal(sessionId, sessionTypeString);
	});
}

function updateSessionModal(sessionId, sessionTypeString) {
	const session = formattedSessionsData.find(s => s.id === sessionId);
	if (session) {
		const speakerElementsHtml = session.speakers.map(speaker => {
			const speakerFullName = speaker ? speaker.fullName : 'Unknown Speaker';
			const companyAnswer = speaker.questionAnswers.find(qa => qa.questionId === 101997);
			const speakerCompany = companyAnswer ? companyAnswer.answerValue : 'Unknown Company';
			const speakerImage = speaker ? speaker.profilePicture : 'https://archive.org/download/placeholder-image//placeholder-image.jpg';
			const speakerId = speaker ? speaker.id : '';
			return `
        <a href="#speaker-${speakerId}" class="session_modal-speaker w-inline-block">
          <img src="${speakerImage}" alt="${speakerFullName} Headshot">
          <div class="session_modal-speaker-text">
            <div class="tag session_modal-speaker-name">${speakerFullName}</div>
            <div class="session_modal-speaker-company">${speakerCompany}</div>
          </div>
        </a>
      `;
		}).join('');
		$('.session_modal-speakers').empty().append(speakerElementsHtml);
		const sessionTitle = session.title;
		const sessionDescriptionRaw = session.description;
		const sessionDescriptionLinked = parseMarkdownLinks(sessionDescriptionRaw);
		const sessionDescription = parseLineBreaks(sessionDescriptionLinked);
		const sessionsSartTime = session.startsAt;
		const sessionsRoom = session.roomId;
		$('[data-element="type"]').text(sessionTypeString);
		$('.session_modal-content').attr('session-type', sessionTypeString);
		$('[data-element="session-title"]').text(sessionTitle)
		if (sessionsSartTime) {
			$('[data-element="session-title"]').text(sessionsSartTime)
		} else {
			$('[data-element="date"]').css('display', 'none');
		}
		if (sessionsSartTime) {
			$('[data-element="time"]').text(sessionsSartTime);
		} else {
			$('[data-element="time"]').text('min').addClass('session-length');
		}
		$('[data-element="description"]').html(sessionDescription);
		if (sessionsRoom) {
			$('[data-element="location"]').html(sessionsRoom);
		} else {
			$('[data-element="location"]').parents('.session_modal-details-row').css('display', 'none');
		}
		updateCategoryInfo(session, 'Level', '[data-element="level"]');
		updateCategoryInfo(session, 'Target Audience', '[data-element="audience"]');
		updateCategoryInfo(session, 'Track', '[data-element="track"]');
	} else {
		console.error('Session with ID ' + sessionId + ' not found.');
		$('[data-element="type"]').text('Session not found');
	}
}

function parseMarkdownLinks(text) {
	const regex = /\[(.*?)\]\((.*?)\)/g;
	return text.replace(regex, '<a href="$2" target="_blank">$1</a>');
}

function parseLineBreaks(text) {
	if (typeof text !== 'string' || !text) {
		return '';
	}
	return text.replace(/\r\n/g, '<br>');
}

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
		$(dataElementSelector).parents('.session_modal-details-row').css('display', 'none');
	}
}

$('[modal-trigger="close"], .session_modal-close').click(function() {
	$(this).parents('dialog')[0].close();
	history.replaceState(null, '', window.location.href.split('#')[0]);
});
$(document).on('click', 'dialog', function(event) {
	if ($(event.target).is(this)) {
		$(this).get(0).close();
		history.replaceState(null, '', window.location.href.split('#')[0]);
	}
});
$('[action="toggle-dropdown"').each(function() {
	$(this).click(function() {
		$(this).parent().toggleClass('open');
	})
});