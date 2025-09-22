function scrollfunctions() {
	gsap.registerPlugin(ScrollTrigger);
	$('[scroll-animation="count-up"]').each(function() {
		const scrollTarget = $(this);
		const scrollTargetText = $(this).find('.stat_feature--number .digits');
		const scrollTargetTextEl = $(this).find('.stat_feature--number');
		const indexVal = scrollTarget.index();
		//store value and the number of digits to use for animation
		let endValue = parseInt($(scrollTargetText).text());
		let xTransition = 0;
		$(scrollTargetText).text('0');
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 80%",
				end: "bottom 50%",
				scrub: true,
			}
		});
		// gsap.set(scrollTargetTextEl, {
		// 			opacity:0,
		// 		})
		fadeIn.from(scrollTarget, {
			opacity: 0,
			y: 40,
			delay: indexVal * .5,
			duration: 1,
		}).from(scrollTargetText, {
			onComplete: countUpNumber,
			duration: .5,
			delay: indexVal * .5,
		}, '=<').to(scrollTarget, {
			duration: .5,
		});

		function countUpNumber() {
			gsap.from(scrollTargetTextEl, {
				opacity: 0,
				duration: .25,
			})
			$(scrollTargetText).prop('Counter', 0).animate({
				Counter: endValue
			}, {
				duration: 1000,
				delay: indexVal * .5,
				easing: 'swing',
				step: function(now) {
					$(scrollTargetText).text(Math.ceil(now));
				}
			});
		}
	});
	$('[scroll-animation="fade-in"]').each(function() {
		const scrollTarget = $(this);
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 80%",
				end: "bottom 70%",
				scrub: true,
			}
		});
		fadeIn.from(scrollTarget, {
			opacity: 0,
			y: '10%',
			duration: .5,
		})
	});
	$('.people_slider--section').each(function() {
		const scrollTarget = $(this);
		const introTextEls = scrollTarget.find('.people_slider--intro_text .text_area');
		const controlEl = scrollTarget.find('.people_slider--names');
		const portaitEls = scrollTarget.find('.people_slider--portraits-item');
		const buttonEls = scrollTarget.find('.c26-button');
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 80%",
				end: "bottom 80%",
				scrub: true,
			}
		});
		fadeIn.from(introTextEls, {
			opacity: 0,
			y: 30,
			duration: .5,
			stagger: .3,
		}).from(controlEl, {
			opacity: 0,
			duration: .5,
		}).from(portaitEls, {
			x: 50,
			opacity: 0,
			duration: .5,
			stagger: .1,
		}).from(buttonEls, {
			y: 50,
			opacity: 0,
			duration: .5,
			stagger: .1,
		}, '=-.25');
	});
	$('[content-layout="wrap"]').each(function() {
		const scrollTarget = $(this);
		const imgEl = scrollTarget.find('.media_content img');
		const textEls = scrollTarget.find('.text_content h3, .text_content h4, .text_content li, .text_content p');
		const indexVal = scrollTarget.parent('.card').index();
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 80%",
				end: "bottom 80%",
				scrub: true,
			}
		});
		fadeIn.from(imgEl, {
			opacity: 0,
			scale: 1.5,
			delay: indexVal * .5,
			duration: .5,
		}).from(textEls, {
			x: -20,
			opacity: 0,
			duration: .5,
			stagger: .1,
		});
	});
	$('section:has(.background_area[background-style=fade-bottom])').each(function() {
		const scrollTarget = $(this);
		const backgroundImageEl = scrollTarget.find('.background_fill')
		const headerEl = scrollTarget.find('h2');
		const textEls = scrollTarget.find('h2 span, p, .c26-button')
		$(headerEl).each(function() {
			const targetText = $(this);
			const text = targetText.text(); // Get the raw text content
			let wordsWrappedHTML = '';
			const words = text.split(/\s+/);
			words.forEach((word, wordIndex) => {
				let charsWrappedInWord = '';
				// Handle empty strings from split (e.g., if there were multiple spaces)
				if (word.length === 0) {
					if (wordIndex < words.length - 1) { // Don't add trailing space if it was the last "word"
						wordsWrappedHTML += `<span class="word-space">&nbsp;</span>`;
					}
					return;
				}
				// Wrap each character within the current word
				for (let i = 0; i < word.length; i++) {
					const char = word[i];
					charsWrappedInWord += `<span class="letter">${char}</span>`;
				}
				wordsWrappedHTML += `<span class="word">${charsWrappedInWord}</span>`;
				if (wordIndex < words.length - 1) {
					wordsWrappedHTML += `<span class="word-space">&nbsp;</span>`;
				}
			});
			// Replace the original h4 content with the new structured HTML
			targetText.html(wordsWrappedHTML);
		});
		const headerLetterEls = headerEl.find('.letter');
		gsap.set(headerLetterEls, {
			display: 'inline-block'
		});
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 60%",
				end: "bottom 80%",
				scrub: true,
			}
		});
		fadeIn.from(backgroundImageEl, {
			opacity: 0,
			scale: 1.5,
			duration: .5,
		}).from(headerLetterEls, {
			y: 20,
			opacity: 0,
			duration: .25,
			stagger: .01,
		}).from(textEls, {
			delay: .25,
			opacity: 0,
			duration: .5,
		});
	});


	const personCardAnimation = $('section:has(.person-card)');
	if (personCardAnimation.length > 0) {
		personCardAnimation.each(function() {
			const scrollTarget = $(this);
			const logoItemsEls = scrollTarget.find('.person-card');
			var fadeInEach = gsap.timeline({
				scrollTrigger: {
					trigger: scrollTarget,
					start: "top 80%",
					end: "bottom 100%",
					scrub: true,
				}
			});
			fadeInEach.from(logoItemsEls, {
				opacity: 0,
				duration: .4,
				stagger: .05,
			});
		});
	}


	
	$('.logo_grid--section').each(function() {
		const scrollTarget = $(this);
		const logoItemsEls = scrollTarget.find('.sponsor_grid-item');
		const textEls = scrollTarget.find('.row > .text_area');
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 60%",
				end: "bottom 100%",
				scrub: true,
				markers: true
			}
		});

			fadeIn.from(textEls, {
				opacity: 0,
				duration: 1,
			}).from(logoItemsEls, {
				opacity: 0,
				duration: .4,
				stagger: .05,
			}, '=-0.25');
			console.log('has text')
		
	});

	const multiCardFade = $('[scroll-animation="fade-in-each"]');
	if( multiCardFade.length > 0) {
		multiCardFade.each(function() {
			const scrollTarget = $(this);
			const staggerEls = scrollTarget.parents('section').find('[scroll-animation="fade-in-each"] > *');
			
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: scrollTarget,
					start: "top 65%",
					end: "bottom 100%",
					scrub: true,
					markers: true
				}
			});

				fadeIn.from(staggerEls, {
					opacity: 0,
					duration: .4,
					stagger: .05,
				});
			
			
	});
	}


	$('.bento_grid--section:has([grid-behavior="scroll"])').each(function() {
		const scrollTarget = $(this);
		const introTextEls = scrollTarget.find('.row > .text_area');
		const contentBlocksEl = scrollTarget.find('.content_grid .content_block ');
		const IconEls = scrollTarget.find('.content_grid .content_block svg');
		const textEls = scrollTarget.find('.content_grid .content_block h3,.content_grid .content_block li,.content_grid .content_block p ');
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 80%",
				end: "bottom 80%",
				scrub: true,
			}
		});
		fadeIn.from(introTextEls, {
			opacity: 0,
			y: 30,
			duration: .5,
			stagger: .3,
		}).from(contentBlocksEl, {
			x: 50,
			opacity: 0,
			duration: .5,
			stagger: .1,
		});
	});
	$('.bento_grid--section:has(.pricing_cards-card)').each(function() {
		const scrollTarget = $(this);
		const introTextEls = scrollTarget.find('.row > .text_area');
		const cardEls = scrollTarget.find('.card');
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 80%",
				end: "bottom 100%",
				scrub: true,
			}
		});
		fadeIn.from(introTextEls, {
			opacity: 0,
			y: 30,
			duration: .5,
			stagger: .3,
		}).from(cardEls, {
			y: 50,
			opacity: 0,
			duration: .5,
			stagger: .1,
		}).from(cardEls, {
			duration: .5,
			stagger: .1,
			'--red': 'rgba(0,0,0,0)',
			'--gold': 'rgba(0,0,0,0)',
			'--blue': 'rgba(0,0,0,0)',
		}, '=-.25');
	});
	// $('[scroll-animation="fade-in-out"]').each(function() {
	// 	let target = $(this);
	// 	var fadeIn = gsap.timeline({
	// 		scrollTrigger: {
	// 			trigger: target,
	// 			start: "top 80%",
	// 			end: "center 70%",
	// 			scrub: true,
	// 		}
	// 	});
	// 	fadeIn.from(target, {
	// 		opacity: 0,
	// 		duration:1,
	// 	}).to(target, {
	// 		opacity: 1,
	// 		duration:2,
	// 	})
	// 	.to(target, {
	// 		opacity: 0,
	// 		duration:1,
	// 	});
	// });
	// ============================
	//stagger-in
	//============================
	// $('[scroll-animation="stagger-in"]').each(function() {
	// 	let children = $(this).find(".accordion, .card");
	// 	var CardStaggerIn = gsap.timeline({
	// 		scrollTrigger: {
	// 			trigger: this,
	// 			start: "top 80%",
	// 			end: "center 70%",
	// 			scrub: true,
	// 		}
	// 	});
	// 	CardStaggerIn.from(children, {
	// 		opacity: 0,
	// 		stagger: 0.1
	// 	});
	// });
}
scrollfunctions();



// $(document).ready(function(){
// 	const rotatorGrid = $('.grid_rotator-grid');
// 	if(rotatorGrid.length > 0){

// 		rotatorGrid.each(function(){

// 			let orderTracker = 1;
// 			const items = rotatorGrid.find('[order]')
// 			const numberOfItems = items.length;


// 			function increment() {
// 								orderTracker ++;
// 				if (orderTracker > numberOfItems ){
// 					orderTracker = 1;
// 				}
// 				console.log(orderTracker);
// 				fadeIn();
// 			}
// 			function fadeIn() {
// 				const targetEl = $(`[order=${orderTracker}]`);

// 				gsap.to(targetEl,{
// 					delay:2,
// 					opacity:0,
// 					scale:1.5,
// 					duration:.75,
// 					zIndex:1,
// 					onComplete:increment,
// 				})
// 				gsap.to(targetEl,{
// 					duration:.01,
// 					zIndex:-1,
// 					delay:3,
// 				})
// 				gsap.to(targetEl,{
// 					opacity:1,
// 					scale:1,
// 					duration:.01,
// 					delay:3.1,
// 				})

// 			}
// 			fadeIn();

	

// 		})
// 	}
// });