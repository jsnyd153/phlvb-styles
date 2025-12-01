// const sessionizeCards = $(".pickup--item");
// sessionizeCards.css("opacity", "0");
let formattedEventData = [];

const listWrapper = $('[fs-cmsfilter-element="list"');
listWrapper.addClass("loading");

window.fsAttributes = window.fsAttributes || [];

window.fsAttributes.push([
	"cmsfilter",
	function (filterInstances) {
		console.log("cmsfilter callback triggered by fsAttributes!");
		if (!filterInstances || filterInstances.length === 0) {
			console.error("cmsfilter callback: filterInstances array is empty or undefined");
			// const listWrapper = $('[fs-cmsfilter-element="list"]');
			listWrapper
				.parent()
				.append(
					`<p>It seems like something is not quite right on our API. Check on <a href="https://opensports.net/PhiladelphiaVolleyball/tab/events">Opensports</a> for more events.</p>`
				);
			return;
		}

		// Get first instance of cmsfilter
		const filterInstance = filterInstances[0];

		if (!filterInstance) {
			console.error("cmsfilter callback: The first filterInstance is undefined.");
			const listWrapper = $('[fs-cmsfilter-element="list"]');
			listWrapper
				.parent()
				.append(
					`<p>It seems like something is not quite right on our API. Check on <a href="https://opensports.net/PhiladelphiaVolleyball/tab/events">Opensports</a> for more events.</p>`
				);
			return;
		}

		const { listInstance } = filterInstance;
		const [firstItem] = listInstance.items;
		const itemTemplateElement = firstItem.element;

		fetchOpensportsData()
			.then(function (data) {
				console.log("Fetched data:", data);

				let items = data.items;

				items = items.filter(function (event) {
					return event.visibility !== "Secret";
				});

				items.sort(function (a, b) {
					// Convert the "start" string to a Date object for comparison
					const dateA = new Date(a.start);
					const dateB = new Date(b.start);
					// Sort ascending (earliest date first)
					return dateA - dateB;
				});

				formattedEventData = items;

				const events = formattedEventData; // Rename to events for clarity

				console.log("events", events);
				console.log("formattedEventData", formattedEventData);

				listInstance.clearItems();

				console.log("Build Events");

				const newCmsItems = events.map(function (event) {
					return createEventItem(event, itemTemplateElement);
				});

				const rawNewCmsItems = newCmsItems.map(function (thisItem) {
					return thisItem[0];
				});

				return listInstance.addItems(rawNewCmsItems);
			}) //process data, clear items, build new items
			.then(function () {
				// Reveal items using GSAP
				const sessionizeCards = $(".pickup--item"); // Re-select items now that they're added
				gsap.to(sessionizeCards, {
					opacity: 1,
					duration: 0.25,
					stagger: 0.15,
					ease: "power2.inOut",
				});

				listWrapper.removeClass("loading");
			}) //reveal items, add any other post creation evens
			.catch(function (error) {
				console.error("Error during CMS update process:", error);
				const listWrapper = $('[fs-cmsfilter-element="list"]');
				listWrapper
					.parent()
					.append(
						`<p>It seems like something is not quite right on our API. Check on <a href="https://opensports.net/PhiladelphiaVolleyball/tab/events">Opensports</a> for more events.</p>`
					);
			});
	}, //function(filterInstances)
]); //fsAttributes.push

function createEventItem(event, templateElement) {
	// Clone the template element using jQuery
	const eventItem = $(templateElement).clone();
	const titleEl = eventItem.find(".pickup-title");
	const dayEl = eventItem.find(".pickup-day");
	const timeEl = eventItem.find(".pickup-time");
	const levelEl = eventItem.find(".pickup-level");
	const locationEl = eventItem.find(".pickup-location");
	const pipeEl = eventItem.find(".pickup-pipebreak");
	const linkEl = eventItem.find(".pickup-link");
	//Grass,indoor,beach
	const filterTypeEl = eventItem.find('[fs-cmsfilter-field="filter-type"]');
	//6,4,3,2
	const filterFormatEl = eventItem.find('[fs-cmsfilter-field="filter-format"]');
	//coed,men,women,revco,blind
	const filterGenderEl = eventItem.find('[fs-cmsfilter-field="filter-gender"]');
	//coed,men,women,revco,blind
	const filterLevelEl = eventItem.find('[fs-cmsfilter-field="filter-level"]');
	const eventTitleData = event.title;

	function removeEmojis(text) {
		const oldEmojiRegex =
			/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu;
		return text.replace(oldEmojiRegex, "");
	}
	const sanitizedTitle = removeEmojis(eventTitleData);
	console.log(sanitizedTitle);
	if (eventTitleData) {
		titleEl.text(sanitizedTitle);
	} else {
		titleEl.hide();
	}
	const eventLevelData = event.level;
	if (eventLevelData) {
		levelEl.html(`Level: <span>${eventLevelData}</span>`);
		filterLevelEl.text(eventLevelData);
	} else {
		levelEl.hide();
	}
	const eventLocationData = event.location.neighborhood;
	if (eventLocationData) {
		locationEl.text(eventLocationData);
	} else {
		const eventTitleData = event.location.title;
		if (eventTitleData) {
			locationEl.text(eventTitleData);
		} else {
			locationEl.text("--");
		}
	}
	const eventTypeData = event.eventType;
	const eventTypeDataSlug = event.eventType.toLowerCase();
	if (eventTypeData) {
		eventItem.attr("color-theme", eventTypeDataSlug);
		filterTypeEl.text(eventTypeData);
	}
	const startDate = event.start;
	const endDate = event.end;
	if (startDate) {
		function formatToDayMonthDate(isoString) {
			const date = new Date(isoString);
			const options = {
				weekday: "long", // e.g., "Saturday"
				month: "short", // e.g., "Sept"
				day: "numeric", // e.g., "27"
				timeZone: "UTC",
			};
			const formatter = new Intl.DateTimeFormat("en-US", options);
			return formatter.format(date);
		}

		function formatToTime(isoString) {
			const date = new Date(isoString);
			const options = {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
				timeZone: "UTC",
			};
			const formatter = new Intl.DateTimeFormat("en-US", options);
			return formatter.format(date);
		}
		const formatStartDate = formatToDayMonthDate(startDate);
		const formatStartTime = formatToTime(startDate);
		const formatEndTime = formatToTime(endDate);
		dayEl.text(formatStartDate);
		if (endDate && startDate) {
			timeEl.text(formatStartTime + " - " + formatEndTime);
		} else if (startDate) {
			timeEl.text(formatStartTime);
		} else {
			timeEl.hide();
			pipeEl.hide();
		}
	}
	const eventURL = "https://opensports.net/posts/" + event.id;
	linkEl.attr("href", eventURL).attr("target", "_blank");
	eventItem.show();
	return eventItem;
} // createEventItem(event, templateElement)

function fetchOpensportsData() {
	console.log("fetchOpensportsData: Function called.");
	const dataSource = "https://philadelphiavolleyball.org/api/events";

	return $.ajax({
		url: dataSource,
		method: "GET",
		dataType: "json",
	}).then(function (response) {
		console.log("fetchOpensportsData: JSON data parsed.");
		console.log(response.items.length, "items found.");
		if (response.items.length < 5) {
			console.warn(
				"There are not many items here which means our API might not be working. Double check on opensports"
			);
			const listWrapper = $('[fs-cmsfilter-element="list"]');
			listWrapper
				.parent()
				.append(
					`<p>It seems like there's not many items here. Check on <a href="https://opensports.net/PhiladelphiaVolleyball/tab/events">Opensports</a> for more events.</p>`
				);
		}
		return response;
	});
}
