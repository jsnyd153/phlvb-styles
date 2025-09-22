function scrollfunctions() {
	gsap.registerPlugin(ScrollTrigger);
	const topBackgroundEl = $('[background-positioning="top"]');
	if (topBackgroundEl.length > 0) {
		$('[background-positioning="top"]').each(function() {
			const scrollTarget = $(this);
			const triggerSection = scrollTarget.parents('section');
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: triggerSection,
					start: "100px 10%",
					end: "400px 10%",
					scrub: true,
				}
			});
			fadeIn.to(scrollTarget, {
				opacity: 0,
				y: '10%',
				duration: .5,
			})
		})
	}


	
	const CountUpAnimationEls = $('[scroll-animation="count-up"]');
	if (CountUpAnimationEls.length > 0) {
		CountUpAnimationEls.each(function() {
    const scrollTarget = $(this);
    const scrollTargetText = $(this).find('.stat_feature--number .digits');
    const scrollTargetNumberContainer = $(this).find('.stat_feature--number');

    const indexVal = scrollTarget.index();
    let endValue = parseInt($(scrollTargetText).text());

    // Initial state: digits text is 0, number container is hidden
    $(scrollTargetText).text('0');
    $(scrollTargetNumberContainer).css('opacity', 0);

    var fadeInTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: scrollTarget,
            start: "top 80%",
            toggleActions: "play reverse play reverse",
            onLeaveBack: () => {
                $(scrollTargetNumberContainer).css('opacity', 0);
                $(scrollTargetText).stop(true, true);
				setTimeout(() => {
                    $(scrollTargetText).text(0);
                }, 200);
            },
            // markers: true, // Uncomment for debugging
        }
    });


    fadeInTimeline.from(scrollTarget, {
        opacity: 0,
        y: 40,
        duration: 1,
        delay: indexVal * .5
    });

    fadeInTimeline.to(scrollTargetNumberContainer, {
        opacity: 1,
        duration: 0.2,
        onComplete: countUpNumber
    }, ">");



    function countUpNumber() {
        // Ensure no old jQuery animation runs before starting a new one
        $(scrollTargetText).stop(true, true);
        $(scrollTargetText).prop('Counter', 0).animate({
            Counter: endValue
        }, {
            duration: 1000, 
            easing: 'swing',
            step: function(now) {
                $(scrollTargetText).text(Math.ceil(now));
            }
        });
    }
});
	} // if CountUpAnimationEls



	const fadeInAnimationEl = $('[scroll-animation="fade-in"]');
	if (fadeInAnimationEl.length > 0) {
		fadeInAnimationEl.each(function() {
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
	} //if fadeInAnimationEl
	const wrapCardAnimationEl = $('[content-layout="wrap"]');
	if (wrapCardAnimationEl.length > 0) {
		wrapCardAnimationEl.each(function() {
			const scrollTarget = $(this);
			const imgEl = scrollTarget.find('.media_content img');
			const textEls = scrollTarget.find('.text_content h3, .text_content h4, .text_content li, .text_content p, .text_content .button-container');
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
	} //if wrapCardAnimationEl
	const peopleSliderEls = $('.people_slider--section');
	if (peopleSliderEls.length > 0) {
		peopleSliderEls.each(function() {
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
	} //peopleSliderEls
	const fullImageSection = $('.full_image--section');
	if (fullImageSection.length > 0) {
		fullImageSection.each(function() {
			const scrollTarget = $(this);
			const backgroundImageEl = scrollTarget.find('.background_fill')
			const headerEl = scrollTarget.find('h2');
			const textEls = scrollTarget.find('h2 span, p, .c26-button')
			wrapWordsLetters(headerEl)
			const headerLetterEls = headerEl.find('.letter');
			gsap.set(headerLetterEls, {
				display: 'inline-block'
			});
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: scrollTarget,
					start: "top 50%",
					end: "bottom 80%",
					scrub: true,
				}
			});
			fadeIn.from(backgroundImageEl, {
				opacity: 0,
				scale: 1.5,
				duration: 1,
			}).from(headerLetterEls, {
				y: 20,
				opacity: 0,
				duration: .25,
				stagger: .01,
			}, '=-.25').from(textEls, {
				delay: .25,
				opacity: 0,
				duration: .5,
				stagger: .25,
			});
		});
	} //fullImageSection
	const personCardAnimation = $('section:has(.person-card)');
	if (personCardAnimation.length > 0) {
		personCardAnimation.each(function() {
			const scrollTarget = $(this);
			const peopleCardEls = scrollTarget.find('.person-card');
			var fadeInEach = gsap.timeline({
				scrollTrigger: {
					trigger: scrollTarget,
					start: "top 80%",
					end: "bottom 100%",
					scrub: true,
				}
			});
			fadeInEach.from(peopleCardEls, {
				opacity: 0,
				duration: .4,
				stagger: .05,
			});
		});
	} //personCardAnimation
	const logoGrid = $('.logo_grid--section');
	if (logoGrid.length > 0) {
		logoGrid.each(function() {
			const scrollTarget = $(this);
			const logoItemsEls = scrollTarget.find('.sponsor_grid-item');
			const textEls = scrollTarget.find('.row > .text_area');
			const numberOfItems = logoItemsEls.length;
			let customStart = '65%';
			const firstElCheck = scrollTarget.prev('section').attr('class');
			// console.log(firstElCheck)
			if (scrollTarget.prev('section').attr('class') == 'basic_hero--section') {
				customStart = '100%';
			}
			//variable end offset position based on the number of items
			//more items means user will scroll longer to finish the animaton
			const endPosition = 40 - numberOfItems + '%'
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: scrollTarget,
					start: `top ${customStart}`,
					end: `top ${endPosition}`,
					scrub: true,
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
		});
	} //logoGrid
	const multiCardFade = $('[scroll-animation="fade-in-each"]');
	if (multiCardFade.length > 0) {
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
	} //multiCardFade
	const bentoWithScroll = $('.bento_grid--section:has([grid-behavior="scroll"])');
	if (bentoWithScroll.length > 0) {
		if (window.matchMedia('(pointer: fine)').matches) {
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
		}
	} //bentoWithScroll
	$('.bento_grid--section:has(.pricing_cards-card)').each(function() {
		const scrollTarget = $(this);
		const introTextEls = scrollTarget.find('.row > .text_area');
		const cardEls = scrollTarget.find('.card');
		var fadeIn = gsap.timeline({
			scrollTrigger: {
				trigger: scrollTarget,
				start: "top 80%",
				end: "center 80%",
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
}
$('#alert-bar-close').click(function() {
	// console.log('clicked')
	$(this).parents('.alert_bar').hide();
})

function wrapWordsLetters(targetText) {
	const text = targetText.text(); // Get the raw text content
	let wordsWrappedHTML = '';
	const words = text.split(/\s+/);
	words.forEach((word, wordIndex) => {
		let charsWrappedInWord = '';
		// Wrap each character within the current word
		for (let i = 0; i < word.length; i++) {
			const char = word[i];
			charsWrappedInWord += `<span class="letter">${char}</span>`;
		}
		// Add the word-space inside the word span, at the end
		if (wordIndex < words.length - 1) { // Only add space if it's not the last word
			wordsWrappedHTML += `<span class="word">${charsWrappedInWord}<span class="word-space">&nbsp;</span></span>`;
		} else {
			wordsWrappedHTML += `<span class="word">${charsWrappedInWord}</span>`;
		}
	});
	// Replace the original h4 content with the new structured HTML
	targetText.html(wordsWrappedHTML);
}
$(document).ready(function() {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	} else {
		scrollfunctions();
	}
})