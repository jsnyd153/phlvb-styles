// OnLoad Animation for HERO
$(document).ready(function() {

    console.log('load')

    const homeCards = $('.home--link');
    if(homeCards.length > 0 ){
        $('.home--link').each(function(index){

            const mediaArea = $(this).find('.home--media_area');
            const textArea = $(this).find('.home--text_area');

            var tl = new TimelineLite({
                delay: 0.5 * index
            });

        tl.from(mediaArea, 1.5, {
			y: '-50',
			opacity: 0,
			// ease: Power2.easeOut,
		}).from(textArea, .75, {
			y: '50',
			opacity: 0,
			// ease: Power2.easeOut,
		}, '-=1.25');

            

        })
    }

	// $('[load-animation="stagger-cards"]').each(function(index) {


	// 	var sectionElement = $(this);
        
        


	// 	var heroCard = sectionElement.find('.card');
	// 	var textContentElements = sectionElement.find('.text_content > *');

	// 	gsap.set(heroCard, {
	// 		clipPath: 'inset(0 100% 0% 0)',
	// 	});
	// 	gsap.set(textContentElements, {
	// 		x: '-20%',
	// 		opacity: 0
	// 	});
	// 	tl.staggerTo(textContentElements, 1, {
	// 		x: '0',
	// 		opacity: 1,
	// 		ease: Power2.easeOut,
    //         stagger: 0.2
	// 	}).to(heroCard, .5, {
	// 		clipPath: 'inset(0 0% 0% 0)',
	// 	}, '-=0.5');
	// });




});