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

console.log("loaded");
// $('[id]').each(function(){

// 	// const buttonLink = $(this).attr('href');

// 	const triggerEl = $(this);
// 	const link = triggerEl.attr('id');
// 	console.log(link)
// 	const buttonLink = $(`[href="#${link}"]`);
// 	console.log(buttonLink)

// 	// buttonLink.css('opacity','.5')

// if (buttonLink.length > 0){
// 		var sectionHighlight = gsap.timeline({
// 			scrollTrigger: {
// 				trigger: triggerEl,
// 				start: "top 100%",
// 				 onEnter: myEnterFunc,
// 				onLeave: myLeaveFunc,
// 				onEnterBack: myEnterFunc,
// 				onLeaveBack: myLeaveFunc,
// 				// end: "bottom 70%",
// 				// scrub: true,
//                 markers:true,
// 			}
// 		});

// function myEnterFunc(){
// 	console.group('myEnterFunc for ' + buttonLink.attr('href'))
// 	$('.button-list').find('.pv25-button').removeClass('active');
// 	buttonLink.addClass('active');

// }
// function myLeaveFunc(){
// 	console.group('myLeaveFunc for ' + buttonLink.attr('href'))
// }

// }

// })
$(document).ready(function () {
	// Cache your jQuery selectors for better performance
	var $slider = $("#distanceFilter");
	var $valueDisplay = $("#distanceFilterValue");

	// 1. Event Handler for real-time updates
	// The 'input' event fires continuously while the user is dragging the slider.
	$slider.on("input", function () {
		// Get the current value of the slider
		var currentValue = $slider.val();

		// Update the text element's content
		$valueDisplay.text(currentValue);
	});

	// 2. Initial Setup (Optional but recommended)
	// Ensures the displayed value matches the slider's initial value
	// when the page first loads.
	$valueDisplay.text($slider.val());
});
