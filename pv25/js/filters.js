console.log("filters");

const fsFilterSection = $('section:has([fs-cmsfilter-element="list"])');
const filterArray = [];

fsFilterSection.find('[fs-cmsfilter-element="list"] [fs-cmsfilter-field]').each(function () {
	const text = $(this).text().trim();
	if ($.inArray(text, filterArray) === -1) {
		filterArray.push(text);
	}
});

fsFilterSection.find('[fs-cmsfilter-element="filters"] [fs-cmsfilter-field]').each(function () {
	const text = $(this).text().trim();
	if ($.inArray(text, filterArray) === -1) {
		$(this).addClass("empty");
	}
});
