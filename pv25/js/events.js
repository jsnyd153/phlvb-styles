///////////////// To DO
// set up click functions to work on speakers
// test on speakers page
// add hover states
// add the on load modal check

//Initialy hide cards that will be replaced and reveal later
const sessionizeCards = $(".person-list-item, .session_list-item");
sessionizeCards.css("opacity", "0");

// Store Global Variables here
let formattedSessionsData = [];
let categoriesData = [];
let formattedSpeakerData = [];

const baseUrl = getBaseUrl();

function getBaseUrl() {
	const currentUrl = window.location.href;
	let baseUrl = currentUrl;

	const speakersIndex = currentUrl.indexOf("/speakers");
	const sessionsIndex = currentUrl.indexOf("/sessions");

	if (speakersIndex !== -1) {
		baseUrl = currentUrl.substring(0, speakersIndex);
	} else if (sessionsIndex !== -1) {
		baseUrl = currentUrl.substring(0, sessionsIndex);
	}

	return baseUrl;
} //getBaseUrl()

window.fsAttributes = window.fsAttributes || [];

window.fsAttributes.push([
	"cmsfilter",
	function (filterInstances) {
		console.log("cmsfilter callback triggered by fsAttributes!");
		if (!filterInstances || filterInstances.length === 0) {
			console.error(
				"cmsfilter callback: filterInstances array is empty or undefined. Is your F'inSweet CMS Filter setup correct on the page?"
			);
			return;
		}

		//select the first filter instance to use
		const filterInstance = filterInstances[0];

		if (!filterInstance) {
			console.error(
				"cmsfilter callback: The first filterInstance is undefined. This is unexpected."
			);
			return;
		}

		const { listInstance } = filterInstance;
		const [firstItem] = listInstance.items;
		const itemTemplateElement = firstItem.element;

		fetchSessionizeData()
			.then(function (data) {
				//log intiial data return for debugging
				console.log(data);

				const sessions = data.sessions;
				const categories = data.categories;
				const rooms = data.rooms;
				const speakers = data.speakers;
				categoriesData = categories;

				console.log("cmsfilter callback: Speakers received:", speakers.length, "items.", speakers);
				//Replace the session ids in the speakers with their corresponding session content
				// Create a mapping of session IDs to session objects for quick lookup
				const sessionMap = data.sessions.reduce((map, session) => {
					map[session.id] = session;
					return map;
				}, {});
				// Iterate through each speaker and replace the session IDs with the full session objects
				formattedSpeakerData = data.speakers.map((speaker) => {
					const speakerSessions = speaker.sessions.map((sessionId) => {
						// Use a Number() conversion to handle string vs. number keys
						return sessionMap[Number(sessionId)] || null;
					});

					// Return a new speaker object with the updated sessions array
					return { ...speaker, sessions: speakerSessions };
				});
				console.log("formattedSpeakerData", formattedSpeakerData);

				//Replace the speaker and category ids in the sessions with their corresponding session content
				console.log("cmsfilter callback: Speakers received:", sessions.length, "items.", sessions);
				formattedSessionsData = sessions.map((session) => {
					// Find and replace speaker IDs with full speaker objects
					session.speakers = session.speakers.map((speakerId) => {
						return speakers.find((speaker) => speaker.id === speakerId);
					});

					// Correctly build the new `categoryItems` array
					const newCategoryItems = categories
						.map((category) => {
							const matchingItems = category.items.filter((item) =>
								session.categoryItems.includes(item.id)
							);
							if (matchingItems.length > 0) {
								return {
									id: category.id,
									title: category.title,
									items: matchingItems,
									sort: category.sort,
									type: category.type,
								};
							}
						})
						.filter(Boolean); // Filters out any categories that had no matching items

					// build categories into the session data by replacing .categoryItems
					session.categoryItems = newCategoryItems;

					//Return modified session with categories and speakers already mapped
					return session;
				});
				console.log("formattedSessionsData", formattedSessionsData);

				listInstance.clearItems();

				if ($(itemTemplateElement).hasClass("session_list-item")) {
					console.log("Build Sessions");
					const newCmsItems = sessions.map(function (session) {
						return createSessionItem(session, itemTemplateElement);
					});
					const rawNewCmsItems = newCmsItems.map(function (thisItem) {
						return thisItem[0];
					});
					return listInstance.addItems(rawNewCmsItems);
				}
				if ($(itemTemplateElement).hasClass("person-list-item")) {
					console.log("Build Speakers");
					const newCmsItems = speakers.map(function (speaker) {
						return createSpeakerItem(speaker, itemTemplateElement);
					});
					const rawNewCmsItems = newCmsItems.map(function (thisItem) {
						return thisItem[0];
					});
					return listInstance.addItems(rawNewCmsItems);
				}
			}) //process data, clear items, build new items
			.then(function () {
				const sessionizeCards = $(".person-list-item, .session_list-item");
				gsap.to(sessionizeCards, {
					opacity: 1,
					duration: 0.25, // The duration of each individual item's animation
					stagger: 0.15, // The delay between the start of each item's animation
					ease: "power2.inOut", // A smooth easing function
				});

				addClickSessionTrigger();
				addClickSpeakerTrigger();
				addCardHover();
				onLoadModal();
				closeModalClicks();
				toggleDropdown();
				// addSegementClicks();
			}) //function for after the cards are added
			.catch(function (error) {
				console.error("Error during CMS update process:", error);
			});
	}, //function(filterInstances)
]); //window.fsAttributes.push

// Build functions

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
		titleEl.css("opacity", "0");
	}

	if (speaker.questionAnswers && speaker.questionAnswers.length > 1) {
		personCompany = speaker.questionAnswers[1].answerValue;
	} else {
		companyEl.css("opacity", "0");
	}

	nameEl.text(speaker.fullName);
	companyEl.text(personCompany);
	titleEl.text(personTitle);
	headshotEl.attr("alt", speaker.fullName + " headshot").attr("src", speaker.profilePicture);
	linkEl.attr("href", "#speaker-" + speaker.id || "");

	speakerItem.show();
	return speakerItem;
} // createSpeakerItem(session, templateElement)

function createSessionItem(session, templateElement) {
	const sessionItem = $(templateElement).clone();

	// Arrays to store the formated speakers
	const speakerTextNamesHtml = []; // html object for the grid cards (pure text)
	const speakerPictureNamesHtml = []; // html object for feature cards (with headshots)

	if (session.speakers && session.speakers.length > 0) {
		session.speakers.forEach(function (speaker) {
			const speakerFullName = speaker ? speaker.fullName : "Speaker TBA"; //name
			const companyAnswer = speaker.questionAnswers.find((qa) => qa.questionId === 101997); // Question holding the company name
			const speakerCompany = companyAnswer ? companyAnswer.answerValue : "Unknown Company"; // Company
			const speakerNamesHtml = `<span>${speakerFullName}, <span class="company">${speakerCompany}</span></span>`; //formatted
			speakerTextNamesHtml.push(speakerNamesHtml); //push each one into the array

			const speakerImage = speaker
				? speaker.profilePicture
				: "https://archive.org/download/placeholder-image//placeholder-image.jpg"; //image source
			const speakerPicturesHtml = `<div class="featured_event-speaker"><img class="profile-picture" src="${speakerImage}" alt="${speakerFullName} headshot"><span>${speakerFullName}, <span class="company">${speakerCompany}</span></span></div>`; //headshot
			speakerPictureNamesHtml.push(speakerPicturesHtml); //push each one into the array
		}); //forEach speaker
	}

	let sessionTypeName = getCategoryNamesByTitle(session.categoryItems, "Session format");
	let sessionLevelName = getCategoryNamesByTitle(session.categoryItems, "Level");
	let sessionAudienceNames = getCategoryNamesByTitleMultivalue(
		session.categoryItems,
		"Target Audience",
		"filter-audience"
	);

	let startTime;
	if (session.startsAt) {
		const dateObj = new Date(session.startsAt);
		startTime = dateObj.toLocaleString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	} else {
		//if there's no actual time, set the time value the session length
		let sessionLength;
		if (sessionTypeName == "Lightning Talk") {
			sessionLength = 15;
		}
		if (sessionTypeName == "Breakout Session") {
			sessionLength = 45;
		}
		if (sessionTypeName == "Keynote") {
			sessionLength = 90;
		}
		if (sessionTypeName == "Training") {
			sessionLength = 30;
		}
		startTime = sessionLength + "min";
	}
	let endTime;
	if (session.endsAt) {
		const dateObj = new Date(session.endsAt);
		endTime = dateObj.toLocaleString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		});
	}
	//format start time for filters/sorting
	let sortDate;
	let filterDate;
	if (session.startsAt) {
		const dateObj = new Date(session.startsAt);
		const year = dateObj.toLocaleString("en-US", { year: "numeric" });
		const month = dateObj.toLocaleString("en-US", { month: "long" });
		const monthShort = dateObj.toLocaleString("en-US", { month: "short" });
		const day = dateObj.toLocaleString("en-US", { day: "numeric" });
		const hour = dateObj.toLocaleString("en-US", { hour: "numeric", hour12: false });
		const minute = dateObj.toLocaleString("en-US", { minute: "2-digit" });

		sortDate = `${month} ${day}, ${year} ${hour}:${minute}`; // format for chronological sort
		filterDate = `${month} ${day}`; // format for date filter
	}

	// Get Room Name
	let roomName;
	if (session.roomId) {
		const room = allRooms.find((s) => s.id === session.roomId);
		roomName = room ? room.name : "Unknown Room";
	}

	//Populate all the field
	const gridSessionElement = sessionItem.find(".event_card-card");
	gridSessionElement
		.parents("a")
		.attr("href", "#session-" + session.id || "")
		.attr("session-type", sessionTypeName[0]);
	gridSessionElement.find('[ct-el="session-title"]').text(session.title || "");
	gridSessionElement.find('[ct-el="session-start-time"]').text(startTime || "");
	gridSessionElement.find('[ct-el="type"]').text(sessionTypeName);
	gridSessionElement.find('[ct-el="speaker-list"]').html(speakerTextNamesHtml.join("/ "));
	gridSessionElement.find('[ct-el="location"]').text(roomName || "");

	const metaElement = sessionItem.find(".meta");
	metaElement.find('[fs-cmsfilter-field="filter-date"]').text(filterDate);
	metaElement.find('[fs-cmsfilter-field="filter-level"]').text(sessionLevelName.join(", "));
	metaElement.find('[fs-cmsfilter-field="filter-audience"]').html(sessionAudienceNames);
	metaElement.find('[fs-cmsfilter-field="filter-type"]').text(sessionTypeName);
	metaElement.find('[fs-cmsfilter-field="sort-date"]').text(sortDate);
	metaElement.find('[fs-cmsfilter-field="search-description"]').text(session.description);
	metaElement.find('[fs-cmsfilter-field="search-name"]').text(session.title);

	sessionItem.show();
	return sessionItem;
} // createSessionItem(session, templateElement)

function fetchSessionizeData() {
	console.log("fetchSessionizeData: Function called.");
	const dataSource = "https://sessionize.com/api/v2/4wat9saa/view/All";

	return $.ajax({
		url: dataSource,
		method: "GET",
		dataType: "json",
	}).then(function (response) {
		console.log("fetchSessionizeData: JSON data parsed.");
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
			rooms: rooms,
		};
	});
} //fetchSessionizeData

function addClickSessionTrigger() {
	$('a[modal-trigger="session-modal"], a[data-element="session-title"]').click(function (e) {
		// e.preventDefault();
		$("dialog").each(function () {
			if (typeof this.close === "function") {
				this.close();
			}
		});
		const href = $(this).attr("href");
		const sessionTypeString = $(this).attr("session-type");
		const sessionId = href.split("#session-").pop();
		updateSessionModal(sessionId, sessionTypeString);
		$(".session_modal-modal").get(0).showModal();
	}); //.click
} //addClickSessionTrigger()
function addClickSpeakerTrigger() {
	// The parent div with the class '.session_modal-speakers' is the most logical
	// static element to attach the event listener to.

	$('a[modal-trigger="speaker-modal"]').click(function (e) {
		// e.preventDefault();
		$("dialog").each(function () {
			if (typeof this.close === "function") {
				this.close();
			}
		});
		const href = $(this).attr("href");
		// Check if href and href.split() are valid
		let speakerId;
		if (href) {
			speakerId = href.split("#speaker-").pop();
		} else {
			window.location.href = `${baseUrl}/speakers`;
		}
		updateSpeakerModal(speakerId);
		$(".speaker_modal-modal").get(0).showModal();
	});

	$(".session_modal-speakers").on("click", "a", function (e) {
		// e.preventDefault();
		$("dialog").each(function () {
			if (typeof this.close === "function") {
				this.close();
			}
		});
		const href = $(this).attr("href");
		// Check if href and href.split() are valid
		let speakerId;
		if (href) {
			speakerId = href.split("#speaker-").pop();
		} else {
			window.location.href = `${baseUrl}/speakers`;
		}
		updateSpeakerModal(speakerId);
		$(".speaker_modal-modal").get(0).showModal();
	});
}

function updateSpeakerModal(speakerId) {
	console.log("updateModal " + speakerId);

	const speaker = formattedSpeakerData.find((s) => s.id === speakerId);

	if (speaker) {
		const companyAndTitleEl = $('[data-element="speaker-title"').parents("p");
		const nameEl = $('[data-element="speaker-name"]');
		const bioEl = $('[data-element="speaker-bio "]');
		const sessionsTitleEl = $('[data-element="session-title"]');
		const sessionsTimeEl = $('[data-element="session-time"]');
		const socialLinksEl = $('[data-element="social-links"]');
		const headshotEl = $('[data-element="headshot"]');

		let companyLink = null;
		let socialLinksObjects = [];

		processSpeakerLinks(speaker);

		function processSpeakerLinks(speaker) {
			if (speaker && Array.isArray(speaker.links)) {
				speaker.links.forEach((link) => {
					if (link.linkType === "Company_Website") {
						//send company link to seperate variable
						companyLink = link.url;
					} else {
						const newLinkData = {
							text: link.title,
							href: link.url,
						};
						const newLink = `<a href="${newLinkData.href}">${newLinkData.text}</a>`;
						console.log(newLink);
						socialLinksObjects.push(newLink);
					}
				});
			}
		} //processSpeakerLinks()

		const socialHtml = socialLinksObjects.join(" ");

		let personTitle;
		let personCompany;
		if (speaker.questionAnswers && speaker.questionAnswers.length > 0) {
			personTitle = speaker.questionAnswers[0].answerValue;
		} else {
			titleEl.css("opacity", "0");
		}
		if (speaker.questionAnswers && speaker.questionAnswers.length > 1) {
			personCompany = speaker.questionAnswers[1].answerValue;
		} else {
			companyEl.css("opacity", "0");
		}
		let personName = speaker.fullName;

		let companyAndTitle;

		console.log(companyLink);
		if (companyLink != null) {
			companyAndTitle = `<span data-element="speaker-title">${personTitle}</span>, <a href="${companyLink}" target="_blank" data-element="company-link">${personCompany}</a></p>`;
		} else {
			companyAndTitle = `<span data-element="speaker-title">${personTitle}</span>, <span data-element="company-link">${personCompany}</a></p>`;
		}

		let personBio;
		console.log(speaker.bio);
		if (speaker.bio) {
			bioEl.show();
			personBio = speaker.bio;
		} else {
			bioEl.hide();
		}

		let sessionsTitle;
		let sessionsLink;
		if (speaker.sessions && speaker.sessions.length > 0) {
			sessionsTitle = speaker.sessions[0].title;
			sessionsTitleEl.parents(".speaker_modal-details-row").show();
			sessionsLink = speaker.sessions[0].id;
		} else {
			sessionsTitleEl.parents(".speaker_modal-details-row").hide();
		}

		let sessionTypeName = getCategoryNamesByTitle(
			speaker.sessions[0].categoryItems,
			"Session format"
		);

		nameEl.text(personName);
		companyAndTitleEl.html(companyAndTitle);
		bioEl.html(personBio);
		sessionsTitleEl
			.text(sessionsTitle)
			.attr("href", "#session-" + sessionsLink)
			.attr("session-type", sessionTypeName[0]);
		sessionsTimeEl.hide();
		socialLinksEl.html(socialHtml);
		headshotEl
			.attr("src", speaker.profilePicture)
			.attr("srcset", speaker.profilePicture)
			.attr("sizes", "")
			.attr("alt", speaker.fullName + "headshot");
	} else {
		console.error("Session with ID " + sessionId + " not found.");
	}
} //updateSessionModal

function updateSessionModal(sessionId, sessionTypeString) {
	console.log("updateModal " + sessionId);
	const session = formattedSessionsData.find((s) => s.id === sessionId);
	if (session) {
		// Build the HTML for all speakers in the session
		const speakerElementsHtml = session.speakers
			.map((speaker) => {
				// Create the HTML string for a single speaker element
				const speakerFullName = speaker ? speaker.fullName : "Unknown Speaker";
				const companyAnswer = speaker.questionAnswers.find((qa) => qa.questionId === 101997);
				const speakerCompany = companyAnswer ? companyAnswer.answerValue : "Unknown Company";
				const speakerImage = speaker
					? speaker.profilePicture
					: "https://archive.org/download/placeholder-image//placeholder-image.jpg";
				const speakerId = speaker ? speaker.id : "";
				return `
            <a href="#speaker-${speakerId}" class="session_modal-speaker w-inline-block">
                <img src="${speakerImage}" alt="${speakerFullName} Headshot">
                <div class="session_modal-speaker-text">
                <div class="tag session_modal-speaker-name">${speakerFullName}</div>
                <div class="session_modal-speaker-company">${speakerCompany}</div>
                </div>
            </a>
            `;
			})
			.join(""); // Join the array of HTML strings into a single string
		// Replace the content of the .session_modal-speakers element with the new speaker elements
		$(".session_modal-speakers").empty().append(speakerElementsHtml);
		const sessionTitle = session.title;
		let sessionDescriptionRaw;
		if (session.description) {
			sessionDescriptionRaw = session.description;
		} else {
			sessionDescriptionRaw = "";
		}
		const sessionDescriptionLinked = parseMarkdownLinks(sessionDescriptionRaw);
		const sessionDescription = parseLineBreaks(sessionDescriptionLinked);
		const sessionsSartTime = session.startsAt;
		const sessionsRoom = session.roomId;
		console.log(sessionTypeString);
		$('[data-element="type"]').text(sessionTypeString);
		$(".session_modal-content").attr("session-type", sessionTypeString);
		$('[data-element="session-title"]').text(sessionTitle);
		if (sessionsSartTime) {
			$('[data-element="session-title"]').text(sessionsSartTime);
		} else {
			$('[data-element="date"]').css("display", "none");
		}
		if (sessionsSartTime) {
			$('[data-element="time"]').text(sessionsSartTime);
		} else {
			$('[data-element="time"]').text("min").addClass("session-length");
		}
		$('[data-element="description"]').html(sessionDescription);
		if (sessionsRoom) {
			$('[data-element="location"]').html(sessionsRoom);
		} else {
			$('[data-element="location"]').parents(".session_modal-details-row").css("display", "none");
		}
		updateCategoryInfo(session, "Level", '[data-element="level"]');
		updateCategoryInfo(session, "Target Audience", '[data-element="audience"]');
		updateCategoryInfo(session, "Track", '[data-element="track"]');
	} else {
		console.error("Session with ID " + sessionId + " not found.");
		// Handle case where session is not found
		$('[data-element="type"]').text("Session not found");
	}
} //updateSessionModal

function onLoadModal() {
	const currentUrl = window.location.href;

	if (currentUrl.indexOf("#speaker") > -1) {
		let speakerId = currentUrl.split("#speaker-").pop();
		if (speakerId.includes("/?")) {
			speakerId = speakerId.split("/?")[0];
		} else {
			speakerId = speakerId;
		}
		updateSpeakerModal(speakerId);
		$(".speaker_modal-modal").get(0).showModal();
	}

	if (currentUrl.indexOf("#session") > -1) {
		let sessionId = currentUrl.split("#session-").pop();
		if (sessionId.includes("/?")) {
			sessionId = sessionId.split("/?")[0];
		} else {
			sessionId = sessionId;
		}

		const sessionType = formattedSessionsData.find((session) => session.id === sessionId)
			?.categoryItems[0]?.items[0]?.name;
		const sessionTypeString = sessionType.replace(/\s*\(.*\)/, "").trim();

		updateSessionModal(sessionId, sessionTypeString);
		$(".session_modal-modal").get(0).showModal();
	}
} //onloadModal()

function closeModalClicks() {
	// Close functions
	// Also removes the session ID from the url
	$('[modal-trigger="close"], .session_modal-close, .speaker_modal-close').click(function () {
		closeModal();
	});
	// Close Modal on click off
	$(document).on("click", "dialog", function (event) {
		if ($(event.target).is(this)) {
			closeModal();
		}
	});
} //closeModalClicks()

function closeModal() {
	$("dialog").each(function () {
		if (typeof this.close === "function") {
			this.close();
		}
	});
	history.replaceState(null, "", window.location.href.split("#")[0]);
} //closeModal()

function toggleDropdown() {
	$('[action="toggle-dropdown"').each(function () {
		$(this).click(function () {
			$(this).parent().toggleClass("open");
		});
	});
	$(".dropdown--container").each(function () {
		const items = $(this).find(".multi-select-input").length;
		$(this).css("--_items", items);
	});
} //toggleDropdown()

function getCategoryNamesByTitleMultivalue(categoryItems, title, filterName) {
	const category = categoryItems.find((c) => c.title === title);
	if (category) {
		// removes content in "()" -> sanitizes the session type
		return category.items
			.map((item) => {
				const name = item.name.replace(/\s*\(.*\)/, "").trim();
				return `<span fs-cmsfilter-field="${filterName}">${name}</span>`;
			})
			.join("");
	}
	return "";
} //getCategoryNamesByTitleMultivalue

function getCategoryNamesByTitle(categoryItems, title) {
	const category = categoryItems.find((c) => c.title === title);
	if (category) {
		return category.items.map((item) => {
			// removes content in "()" -> sanitizes the session type
			return item.name.replace(/\s*\(.*\)/, "").trim();
		});
	}
	return [];
} //getCategoryNamesByTitle

function updateCategoryInfo(session, categoryTitle, dataElementSelector) {
	const category = session.categoryItems.find((c) => c.title === categoryTitle);

	if (category) {
		const names = category.items.map((item) => item.name).join(", ");
		if (names) {
			$(dataElementSelector).html(names);
		} else {
			$(dataElementSelector).parents(".session_modal-details-row").css("display", "none");
		}
	} else {
		$(dataElementSelector).parents(".session_modal-details-row").css("display", "none");
	}
} //updateCategoryInfo
function parseMarkdownLinks(text) {
	const regex = /\[(.*?)\]\((.*?)\)/g;
	return text.replace(regex, '<a href="$2" target="_blank">$1</a>');
} //parseMarkdownLinks
function parseLineBreaks(text) {
	if (typeof text !== "string" || !text) {
		return "";
	}
	// Replace all occurrences of \r\n with the HTML <br> tag
	return text.replace(/\r\n/g, "<br>");
} //parseLineBreaks

function addCardHover() {
	const brandHoverCards = $(".session_list-item, .person-list-item a");
	if (brandHoverCards.length > 0) {
		brandHoverCards.each(function () {
			const thisItem = $(this); // Cache the jQuery object for the current item
			const colorSetting = thisItem.find('[ct-el="session-link"]').attr("session-type");
			let colors = [];
			colors = ["rgba(254, 165, 57, 1)", "rgba(246, 65, 92, 1)", "rgba(97, 123, 238, 1)"];
			if (colorSetting == "Lightning Talk") {
				colors = ["rgb(84, 80, 224)", "rgb(114, 176, 254)", "rgb(84, 80, 224)"];
			}
			if (colorSetting == "Breakout Session") {
				colors = ["rgba(254, 162, 55, 1)", "rgba(245, 194, 127, 1)", "rgba(254, 162, 55, 1)"];
			}
			if (colorSetting == "Keynote") {
				colors = ["rgba(246, 63, 92, 1)", "rgba(250, 141, 90, 1)", "rgba(246, 63, 92, 1)"];
			}
			if (colorSetting == "Training") {
				colors = ["rgba(126, 44, 191, 1)", "rgba(183, 116, 243, 1)", "rgba(126, 44, 191, 1)"];
			}

			const initialGoldColor = getComputedStyle(thisItem[0]).getPropertyValue("--_gold");
			thisItem.on("mouseenter", function () {
				gsap.killTweensOf(this);
				gsap.to(this, {
					duration: 0.5,
					"--_gold": colors[0],
					"--_red": colors[1],
					"--_blue": colors[2],
					"--_logo-opacity": "1",
					"--_glow-opacity": "1",
					ease: "power4.out",
				});
				// Attach mouseleave event listener for hover-out animation
				thisItem.on("mouseleave", function () {
					gsap.killTweensOf(this);
					gsap.to(this, {
						duration: 2,
						delay: 0.1,
						"--_gold": initialGoldColor,
						"--_red": initialGoldColor,
						"--_blue": initialGoldColor,
						"--_logo-opacity": ".9",
						"--_glow-opacity": "0",
						ease: "power4.out",
					});
				});
			});
		});
	}
} //addCardHover
