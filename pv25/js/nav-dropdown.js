function scrollfunctions() {
	gsap.registerPlugin(ScrollTrigger);

  $('[scroll-animation="count-up"]').each(function(){
    const scrollTarget = $(this);
    const scrollTargetLabel = $(this).parents().find('.stat_feature--label');

    //store value and the number of digits to use for animation
    let endValue = $(scrollTarget).text();
    let timing = endValue.length;
    //set initial display value to 0
    $(scrollTarget).text('0');

  ScrollTrigger.create({
		trigger:  scrollTarget, 
		start: "bottom 100%", 
		end: "center 50%", 
    once:true,
		scrub: true,  
		// markers:true,
		onEnter: function() { 
      gsap.from(scrollTarget, { opacity: 0,  duration: 1 });
      $(scrollTarget).prop('Counter',0).animate({
            Counter: endValue
        }, {
          
            duration: timing * 1000,
            easing: 'swing',
            step: function (now) {
                $(scrollTarget).text(Math.ceil(now));
            }
        });
		},    
	});
})


$('[scroll-animation="fade-in"]').each(function() {
	let target = $(this);
	var fadeIn = gsap.timeline({
		scrollTrigger: {
			trigger: target,
			start: "top 80%",
			end: "center 70%",
			scrub: true,
		}
	});
	fadeIn.from(target, {
		opacity: 0,
		stagger: 0.1
	});
});

$('[scroll-animation="fade-in-out"]').each(function() {
	let target = $(this);
	var fadeIn = gsap.timeline({
		scrollTrigger: {
			trigger: target,
			start: "top 80%",
			end: "center 70%",
			scrub: true,
		}
	});
	fadeIn.from(target, {
		opacity: 0,
		duration:1,
	}).to(target, {
		opacity: 1,
		duration:2,
	})
	.to(target, {
		opacity: 0,
		duration:1,
	});
});


// ============================
	//stagger-in
	//============================
	$('[scroll-animation="stagger-in"]').each(function() {
		let children = $(this).find(".accordion, .card");
		var CardStaggerIn = gsap.timeline({
			scrollTrigger: {
				trigger: this,
				start: "top 80%",
				end: "center 70%",
				scrub: true,
			}
		});
		CardStaggerIn.from(children, {
			opacity: 0,
			stagger: 0.1
		});
	});
}
scrollfunctions();



// // OnLoad Animation for HERO
// $(document).ready(function() {
// 	// Select all elements with attribute [aic-animation="hero-load"]
// 	$('[aic-animation="hero-load"]').each(function(index) {
// 		var $element = $(this);
// 		var tl = new TimelineLite({
// 			delay: 0.25 * index
// 		});
// 		var $backgroundArea = $element.find('.hero--background_area');
// 		var $textContentElements = $element.find('.text_content > *');
// 		gsap.set($backgroundArea, {
// 			scale: 1.2,
// 			opacity: 0
// 		});
// 		gsap.set($textContentElements, {
// 			x: '-20%',
// 			opacity: 0
// 		});
// 		tl.to($backgroundArea, .5, {
// 			opacity: 1,
// 			scale: 1
// 		}).staggerTo($textContentElements, 1, {
// 			x: '0',
// 			opacity: 1,
// 			ease: Power2.easeOut
// 		}, 0.2, '-=0.25');
// 	});
// });




// //scroll triggers
// function scrollFunctionsAll() {
// 	gsap.registerPlugin(ScrollTrigger);


    
// 	//============================
// 	//STEP 1
// 	//============================
// 	const startMain = "top 50%"
// 	const startSecondary = "top 40%"
// 	const starrTertiary = "top 35%"
// 	ScrollTrigger.create({
// 		trigger: "#section-1", 
// 		start: "top 60%", 
// 		end: "center 50%", 
// 		scrub: true, 
// 		markers:true,
// 		onEnter: function() {
// 			$(".steps--section").attr("track-state", "1");
// 		},
// 	});
// 	var Step1Main = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".step_1",
// 			start: startMain,
// 			end: "bottom 50%",
// 			scrub: true,
// 		}
// 	});
// 	Step1Main.from(".step_1--main", {
// 		y: "10%",
// 		opacity: 0,
// 		duration: 1
// 	}).to(".step_1--main", {
// 		y: "0%",
// 		opacity: 1,
// 		duration: 2
// 	}).to(".step_1--main", {
// 		duration: 2
// 	}).to(".step_1--main", {
// 		opacity: 0,
// 		y: "-10%",
// 		duration: 1,
// 	});
// 	var Step1Secondary = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".step_1",
// 			start: startSecondary,
// 			end: "bottom 50%",
// 			scrub: true,
// 		}
// 	});
// 	Step1Secondary.from(".step_1--secondary", {
// 		y: "10%",
// 		opacity: 0,
// 		duration: 1,
// 		'--_scale':0,
// 	}).to(".step_1--secondary", {
// 		y: "0%",
// 		opacity: 1,
// 		'--_scale':1,
// 		duration: 1
// 	}).to(".step_1--secondary", {
// 		duration: 2
// 	}).to(".step_1--secondary", {
// 		opacity: 0,
// 		y: "-10%",
// 		duration: 1,
// 	});

// 	//============================
// 	//STEP 2
// 	//============================
// 	ScrollTrigger.create({
// 		trigger: ".step_2", 
// 		start: startSecondary,
// 		end: "center 50%", 
// 		scrub: true, 
// 		onEnter: function() {
	
// 			$(".steps--section").attr("track-state", "2");
// 		},
// 		onLeaveBack: function() {

// 			$(".steps--section").attr("track-state", "1");
// 		}
// 	});
// 	var Step2Main = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".step_2",
// 			start: startMain,
// 			end: "bottom 50%",
// 			scrub: true,
// 		}
// 	});
// 	Step2Main.from(".step_2--main", {
// 		y: "10%",
// 		opacity: 0,
// 		duration: 1
// 	}).to(".step_2--main", {
// 		y: "0%",
// 		opacity: 1,
// 		duration: 4
// 	}).to(".step_2--main", {
// 		opacity: 0,
// 		y: "-10%",
// 		duration: 1,
// 	});
// 	var Step2Secondary = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".step_2",
// 			start: startSecondary,
// 			end: "bottom 50%",
// 			scrub: true,
// 		}
// 	});
// 	Step2Secondary.from(".step_2--secondary", {
// 		y: "10%",
// 		opacity: 0,
// 		duration: 1,
// 		'--_scale':0,
// 	}).to(".step_2--secondary", {
// 		y: "0%",
// 		opacity: 1,
// 		'--_scale':1,
// 		duration: 1
// 	}).to(".step_2--secondary", {
// 		duration: 2
// 	}).to(".step_2--secondary", {
// 		opacity: 0,
// 		y: "-10%",
// 		duration: 1,
// 	});


// 	//============================
// 	//STEP 3
// 	//============================
// 	ScrollTrigger.create({
// 		trigger: ".step_3", 
// 		start: startSecondary, 
// 		end: "center 50%", 
// 		scrub: true, 
// 		onEnter: function() {
// 			$(".steps--section").attr("track-state", "3");
// 		},
// 		onLeaveBack: function() {
// 			$(".steps--section").attr("track-state", "2");
// 		}
// 	});
// 	var Step3Main = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".step_3",
// 			start: startMain,
// 			end: "bottom 50%",
// 			scrub: true,
// 		}
// 	});
// 	Step3Main.from(".step_3--main", {
// 		y: "10%",
// 		opacity: 0,
// 		duration: 1
// 	}).to(".step_3--main", {
// 		y: "0%",
// 		opacity: 1,
// 		duration: 4
// 	}).to(".step_3--main", {
// 		opacity: 0,
// 		y: "-10%",
// 		duration: 1,
// 	});
// 	var Step3Secondary = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".step_3",
// 			start: startSecondary,
// 			end: "bottom 50%",
// 			scrub: true,
// 		}
// 	});
// 	Step3Secondary.from(".step_3--secondary", {
// 		y: "10%",
// 		opacity: 0,
// 		'--_scale':0,
// 		duration: 1
		
// 	}).to(".step_3--secondary", {
// 		y: "0%",
// 		opacity: 1,
// 		'--_scale':1,
// 		duration: 1
// 	}).to(".step_3--secondary", {
// 		duration: 2
// 	}).to(".step_3--secondary", {
// 		opacity: 0,
// 		y: "-10%",
// 		duration: 1,
// 	});
// 	var Step3Tertiary = gsap.timeline({
// 		scrollTrigger: {
// 			trigger: ".step_3",
// 			start: starrTertiary,
// 			end: "bottom 50%",
// 			scrub: true,
// 		}
// 	});
// 	Step3Tertiary.from(".step_3--tertiary", {
// 		y: "10%",
// 		opacity: 0,
// 		duration: 1
// 	}).to(".step_3--tertiary", {
// 		y: "0%",
// 		opacity: 1,
// 		duration: 4
// 	}).to(".step_3--tertiary", {
// 		opacity: 0,
// 		y: "-10%",
// 		duration: 1,
// 	});
// 	//============================
// 	//grid_content--section
// 	//============================
// 	$('.grid_content--section').each(function() {
// 		let children = $(this).find(".text_area, .card, .industry_item");
// 		var CardStaggerIn = gsap.timeline({
// 			scrollTrigger: {
// 				trigger: this,
// 				start: "top 80%",
// 				end: "center 70%",
// 				scrub: true,
// 			}
// 		});
// 		CardStaggerIn.from(children, {
// 			opacity: 0,
// 			stagger: 0.1
// 		});
// 	});
// 	//============================
// 	//Stack Block
// 	//============================
// 	$('.stack--section').each(function() {
// 		let imageEl = $(this).find('.stack--media_content img');
// 		let headline = $(this).find('h2');
// 		var stackAnimationIn = gsap.timeline({
// 			scrollTrigger: {
// 				trigger: this,
// 				start: "top 100%",
// 				end: "bottom 20%",
// 				scrub: true,
// 			}
// 		});
// 		stackAnimationIn.from(imageEl, {
// 			opacity: 0,
// 			scale: 1.5,
// 			duration: 2
// 		}).from(headline, {
// 			x: "-10%",
// 			duration: 1
// 		}, -.5)
// 	});
// 	//============================
// 	//people--section
// 	//============================
// 	$('.people--section').each(function() {
// 		let children = $(this).find(".text_area, .people--content_group, .chat--title");
// 		var CardStaggerIn = gsap.timeline({
// 			scrollTrigger: {
// 				trigger: this,
// 				start: "top 80%",
// 				end: "center 50%",
// 				scrub: true,
// 			}
// 		});
// 		CardStaggerIn.from(children, {
// 			opacity: 0,
// 			stagger: 0.1
// 		});
// 	});
// 	$('.columns--section').each(function() {
// 		let children = $(this).find(".current-announcement, .card_list--column .card");
// 		var CardStaggerIn = gsap.timeline({
// 			scrollTrigger: {
// 				trigger: this,
// 				start: "top 80%",
// 				end: "center 50%",
// 				scrub: true,
// 			}
// 		});
// 		CardStaggerIn.from(children, {
// 			opacity: 0,
// 			stagger: 0.3
// 		});
// 	});
// }; //All Scroll Functions
// scrollFunctionsAll();
