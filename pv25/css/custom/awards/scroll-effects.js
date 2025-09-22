// OnLoad Animation for HERO
$(document).ready(function() {


	// //Onload animations
	// function onLoadAimation() {
	// 	$('[load-animation="stair-hero"]').each(function(index) {
	// 		var sectionElement = $(this);
	// 		var tl = new TimelineLite({
	// 			delay: 0.25 * index
	// 		});
	// 		var heroText = sectionElement.find('h1 span');
	// 		gsap.set(heroText, {
	// 			x: '-20%',
	// 			opacity: 0,
	// 		});
	// 		tl.staggerTo(heroText, 1, {
	// 			x: '0%',
	// 			opacity: 1,
	// 			ease: Power2.easeInOut,
	// 			stagger: 0.3
	// 		});
	// 	});
	// }
	// onLoadAimation()




	function prefooterAimation() {
		//Animate Card	
		$('.pre_footer--section').each(function() {
			const card = $(this).find('.pre_footer--row');
			gsap.set(card, {
				clipPath: 'inset(0 100% 0% 0)',
			});
			var fadeOutBackground = gsap.timeline({
				scrollTrigger: {
					trigger: this,
					start: "center 70%",
				}
			});
			fadeOutBackground.to(card, {
				clipPath: 'inset(0 0% 0% 0)',
				duration: 1,
			});
		});
		//Animate Backgrounds
		$('.pre_footer--section').each(function() {
			const pageBackground = $('main .background_area');
			const elementBackground = $(this).find('.background_area');
			const wave1 = $(elementBackground).find('.pf-wave-1');
			const wave2 = $(elementBackground).find('.pf-wave-2');
			const grad1 = $(elementBackground).find('.pf-1');
			const grad2 = $(elementBackground).find('.pf-2');
			const grad3 = $(elementBackground).find('.pf-3');
			const pfBurst = $(elementBackground).find('.pf-burst')
			//fade out page background
			var fadeOutBackground = gsap.timeline({
				scrollTrigger: {
					trigger: this,
					start: "top 100%",
					end: "top 60%",
					scrub: true,
				}
			});
			fadeOutBackground.to(pageBackground, {
				opacity: 0,
			});
			//inner background transition
			var fadeInBackground = gsap.timeline({
				scrollTrigger: {
					trigger: this,
					start: "top 90%",
					end: "top 10%",
					scrub: true,
				}
			});
			fadeInBackground.from(wave1, {
				opacity: 0,
				x: '-5%',
				y: '20%',
				duration: 1.2,
			}).from(wave2, {
				opacity: 0,
				x: '5%',
				y: '20%',
				duration: 1.2,
			}, '-=.8').from(grad1, {
				opacity: 0,
				duration: .5,
			}, '-=.3').from(grad2, {
				opacity: 0,
				duration: .5,
			}, '-=.3').from(grad3, {
				opacity: 0,
				duration: .5,
			}, '-=.3').from(pfBurst, {
				opacity: 0,
				x: '30%',
				duration: .5,
			}, '-=1.2');
		});
	}
	prefooterAimation();
});