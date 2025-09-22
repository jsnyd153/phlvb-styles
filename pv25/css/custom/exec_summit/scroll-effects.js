// OnLoad Animation for HERO
$(document).ready(function() {
	$('[load-animation="exec-hero"]').each(function(index) {


		var sectionElement = $(this);
        
		var tl = new TimelineLite({
			delay: 0.25 * index
		});

		var heroCard = sectionElement.find('.card');
		var textContentElements = sectionElement.find('.text_content > *');
		gsap.set(heroCard, {
			clipPath: 'inset(0 100% 0% 0)',
		});
		gsap.set(textContentElements, {
			x: '-20%',
			opacity: 0
		});
		tl.staggerTo(textContentElements, 1, {
			x: '0',
			opacity: 1,
			ease: Power2.easeOut,
            stagger: 0.2
		}).to(heroCard, .5, {
			clipPath: 'inset(0 0% 0% 0)',
		}, '-=0.5');
	});






function scrollfunctions() {
	gsap.registerPlugin(ScrollTrigger);



	$('[scroll-animation="reveal-text"] .body-text-jumbo').each(function() {

        //wrap with span
        $(this).wrapInner('<span class="reveal"></span>')
        //animate text gradient on span
		let target = $(this).find('.reveal');
		var CardStaggerIn = gsap.timeline({
			scrollTrigger: {
				trigger: this,
				start: "top 70%",
				end: "bottom 70%",
				scrub: true,
                // markers:true,
			}
		});
		CardStaggerIn.to(target, {
			backgroundSize:'100%',
            
		});
	});
	$('[scroll-animation="fade-in"] .body-text-jumbo').each(function() {


		let target = $(this);
		var staggerIn = gsap.timeline({
			scrollTrigger: {
				trigger: this,
				start: "top 90%",
				end: "top 50%",
				scrub: true,
                // markers:true,
			}
		});
		staggerIn.from(target, {
			opacity:0,
		})

		var staggerOut = gsap.timeline({
			scrollTrigger: {
				trigger: this,
				start: "bottom 20%",
				end: "bottom 0%",
				scrub: true,
                // markers:true,
			}
		});
		staggerOut.to(target, {
			opacity:0,
			y:'-15%'
		})
	});
    

$('[scroll-animation="fade-in-out"]').each(function() {
	let target = $(this);

	var fadeIn = gsap.timeline({
		scrollTrigger: {
			trigger: target,
			start: "top 80%",
			end: "bottom 20%",
			scrub: true,
		}
	});
	fadeIn.from(target, {
		opacity: 0,
		duration:1,
	});
	var fadeOut = gsap.timeline({
		scrollTrigger: {
			trigger: target,
			start: "bottom 20%",
			end: "bottom 0%",
			scrub: true,
		}
	});
	fadeOut.to(target, {
		opacity: 0,
		y:'-15%',
		duration:1,
	});
});


	$('[scroll-animation="stagger-cards"]').each(function() {
        // console.log(this)
		let target = $(this);
		let children = $(this).find(".card");
		var CardStaggerIn = gsap.timeline({
			scrollTrigger: {
				trigger: this,
				start: "top 80%",
				end: "bottom 80%",
				scrub: true,
			}
		});
		CardStaggerIn.from(children, {
			opacity: 0,
            y:'5%',
			stagger: 0.2
		});
	});

	$('[scroll-animation="each-card"] .card').each(function() {
        // console.log(this)
		let target = $(this);
		// let children = $(this).find(".card");
		var CardStaggerIn = gsap.timeline({
			scrollTrigger: {
				trigger: this,
				start: "top 90%",
				end: "bottom 80%",
				scrub: true,
			}
		});
		CardStaggerIn.from(target, {
			opacity: 0,
            y:'5%',
			stagger: 0.2
		});
	});


	$('.image_aside--section').each(function() {

		let trigger = $(this);
        let cards = $(this).find('.card');

		var CardStaggerIn = gsap.timeline({
			scrollTrigger: {
				trigger: trigger,
                start: "top 80%",
				end: "bottom 70%",
				scrub: true,
                // markers:true,
			}
		});
		CardStaggerIn.from(cards, {
            opacity: 0,
            y:'10%',
			stagger: 0.4
		});

	});




}



scrollfunctions();


});