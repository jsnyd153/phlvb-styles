function loadAnimations() {
	const imageHeroEl = $(".hero_image--section");
	const homeHeroEl = $(".feature_hero--section");
	const introTextSection = imageHeroEl.next(".bento_grid--section");

	// if (imageHeroEl.length > 0) {
	// 	imageHeroEl.each(function () {
	// 		const sectionEl = $(this);
	// 		const imageEl = $(this).find(".hero_image--media_area img");

	// 		const headlineEl = $(introTextSection).find(".row > .text_area:nth-child(1)");
	// 		const bodyEl = $(introTextSection).find(".row > .text_area:nth-child(2) p");

	// 		var animation = gsap
	// 			.timeline()
	// 			.from(sectionEl, {
	// 				duration: 0.5,
	// 				opacity: 0,
	// 				"clip-path": "inset(0% 100% 0% 0%)",
	// 				// delay: 0.25,
	// 			})
	// 			.from(imageEl, {
	// 				duration: 0.75,
	// 				"clip-path": "inset(0% 0% 0% 100%)",
	// 			});
	// 		animation.play();
	// 	});
	// }
	if (homeHeroEl.length > 0) {
		homeHeroEl.each(function () {
			const sectionEl = $(this);
			const mediaArea = sectionEl.find(".media_area");
			const mediaContentMiddle = sectionEl.find("#pickup-origin-media");
			const mediaContentOuter = sectionEl.find("#tournament-image, #league-image");
			const mediaContentAll = sectionEl.find(".media_area .media_content");
			const overlayEl = sectionEl.find(".overlay");
			const headlineEl = sectionEl.find("h1");
			const headlineInnerEl = sectionEl.find("h1 span");

			var loadAnimation = gsap
				.timeline()
				.from(overlayEl, {
					duration: 1,
					opacity: 0,
					delay: 1,
				})
				.from(
					headlineInnerEl,
					{
						duration: 2,

						"background-size": "0% 100%",
					},
					"=-.75",
				);

			loadAnimation.play();

			const timing = 8000;

			const tabEl = sectionEl.find(".feature_hero--grid_content .content_block");
			tabEl.prepend(`<div class="track"><div class="fill"></div></div>`);

			let currentAnimation;

			tabEl.on("click", function () {
				const contentID = $(this).attr("id");
				if (contentID) {
					if (currentAnimation) {
						currentAnimation.kill();
					}
					runTabFunction(contentID);
				}
			});

			function getNextContentID() {
				const currentActive = sectionEl.find(".content_block.active-tab");
				let nextEl = currentActive.next(".content_block");

				if (nextEl.length === 0) {
					nextEl = tabEl.first();
				}

				return nextEl.attr("id");
			}

			function runTabFunction(contentID) {
				const targetMedia = $(`#${contentID}-image`);
				const targetButton = $(`#${contentID}`);

				// Find the current active elements (before we change classes)
				const currentMedia = sectionEl.find("img.active-tab");
				const currentButton = sectionEl.find(".content_block.active-tab");

				const allMedia = sectionEl.find(".media_content");

				// --- FIX: Z-Index Setup MUST OCCUR BEFORE CLASS REMOVAL ---

				// 1. Set all media elements to a low base z-index (e.g., 1).
				gsap.set(allMedia, { zIndex: 1 });

				// 2. Set the current (outgoing) image to the highest z-index (e.g., 3).
				// This keeps the OLD image on top and prevents it from disappearing early.
				gsap.set(currentMedia, { zIndex: 3 });

				// 3. Set the target (incoming) image to the middle z-index (e.g., 2).
				gsap.set(targetMedia, { zIndex: 2 });

				// --- 1. Update Active Classes and Reset Track ---
				// Now that z-index is locked, we can safely remove the old classes and set the new ones.

				// Remove active class and reset track for the OLD button
				currentButton.removeClass("active-tab").find(".track .fill").css("width", 0);

				// IMPORTANT: We REMOVE the active-tab class from currentMedia LATER in the onComplete.
				// If we remove it now, it loses its z-index styling associated with .active-tab (if any)
				// AND it loses its identity for the 'currentMedia' selector on the next loop.

				// Set the new target elements as active
				targetButton.addClass("active-tab");
				targetMedia.addClass("active-tab"); // The incoming image is now active

				const targetTrack = targetButton.find(".track .fill");

				// --- 2. Build the GSAP Timeline ---
				currentAnimation = gsap.timeline({
					defaults: { duration: 1 },
					onComplete: () => {
						// IMPORTANT: Reset the 'just hidden' media's clip-path and z-index
						gsap.set(currentMedia, {
							"clip-path": "inset(0 0 0 0)",
							zIndex: 1, // Reset it to the base layer
							scale: 1,
						});

						// NOW we can safely remove the active-tab class from the image that just finished transitioning out.
						currentMedia.removeClass("active-tab");

						// --- 3. Auto-Advance to the Next Tab ---
						const nextID = getNextContentID();
						runTabFunction(nextID);
					},
				});

				currentAnimation
					// A. Clip the current image from left (0%) to right (100%)
					.to(
						currentMedia,
						{
							"clip-path": "inset(0 100% 0 0)",
							ease: "power2.inOut",
						},
						0,
					)

					// B. Reveal the target image from left (0%) to right (0%)
					.fromTo(
						targetMedia,
						{
							"clip-path": "inset(0  0 0 100%)",
						},
						{
							"clip-path": "inset(0 0 0 0%)",
							ease: "power2.inOut",
						},
						0,
					)

					// C. Start the visual timer
					.to(
						targetTrack,
						{
							width: "100%",
							duration: timing / 1000,
							ease: "linear",
						},
						0,
					)
					.to(
						targetMedia,
						{
							scale: 1.2,
							duration: timing / 1000,
							ease: "linear",
						},
						0,
					);
			}

			// Auto-run the function on page load for the first element
			function startLoopAnimation() {}
			const initialID = tabEl.first().attr("id");
			if (initialID) {
				runTabFunction(initialID);
			}
		});
	}

	if (imageHeroEl.length > 0) {
		imageHeroEl.each(function () {
			const sectionEl = $(this);
			const imageEl = $(this).find(".hero_image--media_area .media_content");

			const headlineEl = $(introTextSection).find(".row > .text_area:nth-child(1)");
			const bodyEl = $(introTextSection).find(".row > .text_area:nth-child(2) p");

			var animation = gsap
				.timeline()
				.from(sectionEl, {
					duration: 0.5,
					opacity: 0,
					"clip-path": "inset(0% 100% 0% 0%)",
					// delay: 0.25,
				})
				.from(imageEl, {
					duration: 0.75,
					"--_clip": "0%",
				});
			animation.play();
		});
	}
}
loadAnimations();

function scrollfunctions() {
	gsap.registerPlugin(ScrollTrigger);

	const imageHeroEl = $(".hero_image--section, .feature_hero--section");
	if (imageHeroEl.length > 0) {
		imageHeroEl.each(function () {
			const triggerSection = $(this);

			const scrollTarget = $(this).find(".hero_image--media_area .media_content img");
			const scrollTargetBackground = $(this).find(".hero_image--media_area");
			gsap.to(scrollTargetBackground, {
				// background: "#000f39",
				delay: 1.25,
				duration: 0.1,
			});
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: triggerSection,
					start: "bottom 50%",
					end: "bottom 10%",
					scrub: true,
				},
			});
			fadeIn.to(scrollTarget, {
				scale: 1.2,
				opacity: 0.8,
				filter: "blur(10px)",
				duration: 0.5,
			});
		});
	}

	const headerNav = $(".nav--header");

	if (imageHeroEl.length > 0) {
		if (headerNav.length > 0) {
			headerNav.each(function () {
				const triggerSection = $("main")[0]; // Get the native DOM element for ScrollTrigger
				const scrollTarget = $(this);

				// Create the ScrollTrigger configuration
				ScrollTrigger.create({
					trigger: triggerSection,
					start: "top 40px",
					// end: "top 10%",
					scrub: true,
					// markers: true,

					// Callback when the scroll enters the defined start/end area
					onEnter: () => {
						scrollTarget.attr("scrolled", "true");
					},

					// Callback when the scroll leaves the defined start/end area going backward (reverse scroll)
					onLeaveBack: () => {
						scrollTarget.removeAttr("scrolled");
					},
				});
			});
		}
	} else {
		console.log("scrolled");
		if (headerNav.length > 0) {
			headerNav.attr("scrolled", "true");
		}
	}

	// const sidebarAreaRight = $(".sidebar_area:nth-child(2)");
	// if (sidebarAreaRight.length > 0) {
	// 	sidebarAreaRight.each(function () {
	// 		const triggerSection = $(this);

	// 		var fadeIn = gsap.timeline({
	// 			scrollTrigger: {
	// 				trigger: triggerSection,
	// 				start: "top 80%",
	// 				end: "bottom 10%",
	// 				// scrub: true,
	// 			},
	// 		});
	// 		fadeIn.from(triggerSection, {
	// 			x: 40,
	// 			opacity: 1,
	// 			duration: 0.5,
	// 			toggleActions: "play none none reverse",
	// 		});
	// 	});
	// }

	const bentoGridSection = $(".bento_grid--row");
	if (bentoGridSection.length > 0) {
		bentoGridSection.each(function () {
			const triggerSection = $(this);
			const leftSide = triggerSection.find("> *:nth-child(odd)");
			const rightSide = triggerSection.find("> *:nth-child(even)");

			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: triggerSection,
					start: "top 80%",
					end: "bottom 10%",
					toggleActions: "play none none reverse",
					// scrub: true,
				},
			});
			fadeIn
				.from(leftSide, {
					x: -40,
					opacity: 0,
					duration: 0.5,
				})
				.from(
					rightSide,
					{
						x: 40,
						opacity: 0,
						duration: 0.5,
					},
					"=-.4",
				);
		});
	}

	const bannerEl = $(".banner--section");
	if (bannerEl.length > 0) {
		bannerEl.each(function () {
			const triggerSection = $(this);
			triggerSection.find(".banner--card").css("clip-path", "inset(5% 50% round 40px 0 )");
			const scrollTarget = $(this).find(".banner--card");
			const textEl = $(this).find(".banner--card .text_area");
			const buttonEl = $(this).find(".banner--card .pv25-button");

			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: triggerSection,
					start: "top 80%",
					end: "bottom 80%",

					toggleActions: "play none none reverse",
				},
			});
			fadeIn
				.to(scrollTarget, {
					"clip-path": "inset(0% 0% round 40px 0)",
					duration: 1.25,
					ease: Power1.easeInOut,
				})
				.from(textEl, {
					opacity: 0,
					duration: 0.75,
				})
				.from(
					buttonEl,
					{
						opacity: 0,
						y: 16,
						duration: 0.5,
						stagger: 0.3,
					},
					"=-.5",
				);
		});
	}

	// const cardListItems = $(".league-item, .tournament-item");
	// if (cardListItems.length > 0) {
	// 	cardListItems.each(function () {
	// 		const triggerEl = $(this);
	// 		var fadeIn = gsap.timeline({
	// 			scrollTrigger: {
	// 				trigger: triggerEl,
	// 				start: "top 90%",
	// 				end: "top 60%",
	// 				scrub: true,
	// 			},
	// 		});
	// 		fadeIn.from(triggerEl, {
	// 			y: 12,
	// 			opacity: 0,
	// 			duration: 0.5,
	// 			ease: Power1.easeInOut,
	// 		});
	// 	});
	// }

	const cardListPickupSection = $("section:has(.pickup-item)");
	if (cardListPickupSection.length > 0) {
		cardListPickupSection.each(function () {
			const triggerEl = $(this);
			const textEl = triggerEl.find(".row > .text_area");
			const cardContainerEl = triggerEl.find(".grid_content:has(.pickup-item)");
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: textEl,
					start: "top 85%",
					end: "top 60%",

					// // markers: true,
				},
			});
			fadeIn
				.from(textEl, {
					x: -40,
					opacity: 0,
					duration: 0.5,
					ease: Power1.easeInOut,
				})
				.from(cardContainerEl, {
					y: 20,
					opacity: 0,
					duration: 0.5,
					ease: Power1.easeInOut,
				});
		});
	}

	const winnerCardGrid = $(
		'.grid_content:has([card-style="winner"]), .row[scroll-trigger="stagger-in-all"]',
	);
	if (winnerCardGrid.length > 0) {
		winnerCardGrid.each(function () {
			const triggerEl = $(this);
			const targetEls = $(this).find(".card");
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: triggerEl,
					start: "top 90%",
					end: "bottom 90%",
					toggleActions: "play none none reverse",
				},
			});
			fadeIn.from(targetEls, {
				y: 12,
				opacity: 0,
				duration: 0.5,
				ease: Power1.easeInOut,
				stagger: 0.3,
			});
		});
	}

	const imageZoom = $('.row[scroll-trigger="image-zoom"]');
	if (imageZoom.length > 0) {
		imageZoom.each(function () {
			const triggerEl = $(this);
			const targetContainer = triggerEl.find(".media_area .media_content");
			targetContainer.css("background-color", "var(--theme--accent-100)");
			const targetEl = triggerEl.find(".media_area .media_content img");
			var fadeIn = gsap.timeline({
				scrollTrigger: {
					trigger: triggerEl,
					start: "top 90%",
					end: "top 40%",
					scrub: true,
				},
			});
			fadeIn.from(targetEl, {
				opacity: 0,
				scale: 1.3,
				duration: 0.5,
			});
		});
	}
}
scrollfunctions();
// 	const CountUpAnimationEls = $('[scroll-animation="count-up"]');
// 	if (CountUpAnimationEls.length > 0) {
// 		CountUpAnimationEls.each(function() {
//     const scrollTarget = $(this);
//     const scrollTargetText = $(this).find('.stat_feature--number .digits');
//     const scrollTargetNumberContainer = $(this).find('.stat_feature--number');

//     const indexVal = scrollTarget.index();
//     let endValue = parseInt($(scrollTargetText).text());

//     // Initial state: digits text is 0, number container is hidden
//     $(scrollTargetText).text('0');
//     $(scrollTargetNumberContainer).css('opacity', 0);

//     var fadeInTimeline = gsap.timeline({
//         scrollTrigger: {
//             trigger: scrollTarget,
//             start: "top 80%",
//             toggleActions: "play reverse play reverse",
//             onLeaveBack: () => {
//                 $(scrollTargetNumberContainer).css('opacity', 0);
//                 $(scrollTargetText).stop(true, true);
// 				setTimeout(() => {
//                     $(scrollTargetText).text(0);
//                 }, 200);
//             },
//             // // markers: true, // Uncomment for debugging
//         }
//     });

//     fadeInTimeline.from(scrollTarget, {
//         opacity: 0,
//         y: 40,
//         duration: 1,
//         delay: indexVal * .5
//     });

//     fadeInTimeline.to(scrollTargetNumberContainer, {
//         opacity: 1,
//         duration: 0.2,
//         onComplete: countUpNumber
//     }, ">");

//     function countUpNumber() {
//         // Ensure no old jQuery animation runs before starting a new one
//         $(scrollTargetText).stop(true, true);
//         $(scrollTargetText).prop('Counter', 0).animate({
//             Counter: endValue
//         }, {
//             duration: 1000,
//             easing: 'swing',
//             step: function(now) {
//                 $(scrollTargetText).text(Math.ceil(now));
//             }
//         });
//     }
// });
// 	} // if CountUpAnimationEls

// 	const fadeInAnimationEl = $('[scroll-animation="fade-in"]');
// 	if (fadeInAnimationEl.length > 0) {
// 		fadeInAnimationEl.each(function() {
// 			const scrollTarget = $(this);
// 			var fadeIn = gsap.timeline({
// 				scrollTrigger: {
// 					trigger: scrollTarget,
// 					start: "top 80%",
// 					end: "bottom 70%",
// 					scrub: true,
// 				}
// 			});
// 			fadeIn.from(scrollTarget, {
// 				opacity: 0,
// 				y: '10%',
// 				duration: .5,
// 			})
// 		});
// 	} //if fadeInAnimationEl
// 	const wrapCardAnimationEl = $('[content-layout="wrap"]');
// 	if (wrapCardAnimationEl.length > 0) {
// 		wrapCardAnimationEl.each(function() {
// 			const scrollTarget = $(this);
// 			const imgEl = scrollTarget.find('.media_content img');
// 			const textEls = scrollTarget.find('.text_content h3, .text_content h4, .text_content li, .text_content p, .text_content .button-container');
// 			const indexVal = scrollTarget.parent('.card').index();
// 			var fadeIn = gsap.timeline({
// 				scrollTrigger: {
// 					trigger: scrollTarget,
// 					start: "top 80%",
// 					end: "bottom 80%",
// 					scrub: true,
// 				}
// 			});
// 			fadeIn.from(imgEl, {
// 				opacity: 0,
// 				scale: 1.5,
// 				delay: indexVal * .5,
// 				duration: .5,
// 			}).from(textEls, {
// 				x: -20,
// 				opacity: 0,
// 				duration: .5,
// 				stagger: .1,
// 			});
// 		});
// 	} //if wrapCardAnimationEl
// 	const peopleSliderEls = $('.people_slider--section');
// 	if (peopleSliderEls.length > 0) {
// 		peopleSliderEls.each(function() {
// 			const scrollTarget = $(this);
// 			const introTextEls = scrollTarget.find('.people_slider--intro_text .text_area');
// 			const controlEl = scrollTarget.find('.people_slider--names');
// 			const portaitEls = scrollTarget.find('.people_slider--portraits-item');
// 			const buttonEls = scrollTarget.find('.c26-button');
// 			var fadeIn = gsap.timeline({
// 				scrollTrigger: {
// 					trigger: scrollTarget,
// 					start: "top 80%",
// 					end: "bottom 80%",
// 					scrub: true,
// 				}
// 			});
// 			fadeIn.from(introTextEls, {
// 				opacity: 0,
// 				y: 30,
// 				duration: .5,
// 				stagger: .3,
// 			}).from(controlEl, {
// 				opacity: 0,
// 				duration: .5,
// 			}).from(portaitEls, {
// 				x: 50,
// 				opacity: 0,
// 				duration: .5,
// 				stagger: .1,
// 			}).from(buttonEls, {
// 				y: 50,
// 				opacity: 0,
// 				duration: .5,
// 				stagger: .1,
// 			}, '=-.25');
// 		});
// 	} //peopleSliderEls
// 	const fullImageSection = $('.full_image--section');
// 	if (fullImageSection.length > 0) {
// 		fullImageSection.each(function() {
// 			const scrollTarget = $(this);
// 			const backgroundImageEl = scrollTarget.find('.background_fill')
// 			const headerEl = scrollTarget.find('h2');
// 			const textEls = scrollTarget.find('h2 span, p, .c26-button')
// 			wrapWordsLetters(headerEl)
// 			const headerLetterEls = headerEl.find('.letter');
// 			gsap.set(headerLetterEls, {
// 				display: 'inline-block'
// 			});
// 			var fadeIn = gsap.timeline({
// 				scrollTrigger: {
// 					trigger: scrollTarget,
// 					start: "top 50%",
// 					end: "bottom 80%",
// 					scrub: true,
// 				}
// 			});
// 			fadeIn.from(backgroundImageEl, {
// 				opacity: 0,
// 				scale: 1.5,
// 				duration: 1,
// 			}).from(headerLetterEls, {
// 				y: 20,
// 				opacity: 0,
// 				duration: .25,
// 				stagger: .01,
// 			}, '=-.25').from(textEls, {
// 				delay: .25,
// 				opacity: 0,
// 				duration: .5,
// 				stagger: .25,
// 			});
// 		});
// 	} //fullImageSection
// 	const personCardAnimation = $('section:has(.person-card)');
// 	if (personCardAnimation.length > 0) {
// 		personCardAnimation.each(function() {
// 			const scrollTarget = $(this);
// 			const peopleCardEls = scrollTarget.find('.person-card');
// 			var fadeInEach = gsap.timeline({
// 				scrollTrigger: {
// 					trigger: scrollTarget,
// 					start: "top 80%",
// 					end: "bottom 100%",
// 					scrub: true,
// 				}
// 			});
// 			fadeInEach.from(peopleCardEls, {
// 				opacity: 0,
// 				duration: .4,
// 				stagger: .05,
// 			});
// 		});
// 	} //personCardAnimation
// 	const logoGrid = $('.logo_grid--section');
// 	if (logoGrid.length > 0) {
// 		logoGrid.each(function() {
// 			const scrollTarget = $(this);
// 			const logoItemsEls = scrollTarget.find('.sponsor_grid-item');
// 			const textEls = scrollTarget.find('.row > .text_area');
// 			const numberOfItems = logoItemsEls.length;
// 			let customStart = '65%';
// 			const firstElCheck = scrollTarget.prev('section').attr('class');
// 			// console.log(firstElCheck)
// 			if (scrollTarget.prev('section').attr('class') == 'basic_hero--section') {
// 				customStart = '100%';
// 			}
// 			//variable end offset position based on the number of items
// 			//more items means user will scroll longer to finish the animaton
// 			const endPosition = 40 - numberOfItems + '%'
// 			var fadeIn = gsap.timeline({
// 				scrollTrigger: {
// 					trigger: scrollTarget,
// 					start: `top ${customStart}`,
// 					end: `top ${endPosition}`,
// 					scrub: true,
// 				}
// 			});
// 			fadeIn.from(textEls, {
// 				opacity: 0,
// 				duration: 1,
// 			}).from(logoItemsEls, {
// 				opacity: 0,
// 				duration: .4,
// 				stagger: .05,
// 			}, '=-0.25');
// 		});
// 	} //logoGrid
// 	const multiCardFade = $('[scroll-animation="fade-in-each"]');
// 	if (multiCardFade.length > 0) {
// 		multiCardFade.each(function() {
// 			const scrollTarget = $(this);
// 			const staggerEls = scrollTarget.parents('section').find('[scroll-animation="fade-in-each"] > *');
// 			var fadeIn = gsap.timeline({
// 				scrollTrigger: {
// 					trigger: scrollTarget,
// 					start: "top 65%",
// 					end: "bottom 100%",
// 					scrub: true,
// 					markers: true
// 				}
// 			});
// 			fadeIn.from(staggerEls, {
// 				opacity: 0,
// 				duration: .4,
// 				stagger: .05,
// 			});
// 		});
// 	} //multiCardFade
// 	const bentoWithScroll = $('.bento_grid--section:has([grid-behavior="scroll"])');
// 	if (bentoWithScroll.length > 0) {
// 		if (window.matchMedia('(pointer: fine)').matches) {
// 			$('.bento_grid--section:has([grid-behavior="scroll"])').each(function() {
// 				const scrollTarget = $(this);
// 				const introTextEls = scrollTarget.find('.row > .text_area');
// 				const contentBlocksEl = scrollTarget.find('.content_grid .content_block ');
// 				const IconEls = scrollTarget.find('.content_grid .content_block svg');
// 				const textEls = scrollTarget.find('.content_grid .content_block h3,.content_grid .content_block li,.content_grid .content_block p ');
// 				var fadeIn = gsap.timeline({
// 					scrollTrigger: {
// 						trigger: scrollTarget,
// 						start: "top 80%",
// 						end: "bottom 80%",
// 						scrub: true,
// 					}
// 				});
// 				fadeIn.from(introTextEls, {
// 					opacity: 0,
// 					y: 30,
// 					duration: .5,
// 					stagger: .3,
// 				}).from(contentBlocksEl, {
// 					x: 50,
// 					opacity: 0,
// 					duration: .5,
// 					stagger: .1,
// 				});
// 			});
// 		}
// 	} //bentoWithScroll
// 	$('.bento_grid--section:has(.pricing_cards-card)').each(function() {
// 		const scrollTarget = $(this);
// 		const introTextEls = scrollTarget.find('.row > .text_area');
// 		const cardEls = scrollTarget.find('.card');
// 		var fadeIn = gsap.timeline({
// 			scrollTrigger: {
// 				trigger: scrollTarget,
// 				start: "top 80%",
// 				end: "center 80%",
// 				scrub: true,
// 			}
// 		});
// 		fadeIn.from(introTextEls, {
// 			opacity: 0,
// 			y: 30,
// 			duration: .5,
// 			stagger: .3,
// 		}).from(cardEls, {
// 			y: 50,
// 			opacity: 0,
// 			duration: .5,
// 			stagger: .1,
// 		}).from(cardEls, {
// 			duration: .5,
// 			stagger: .1,
// 			'--red': 'rgba(0,0,0,0)',
// 			'--gold': 'rgba(0,0,0,0)',
// 			'--blue': 'rgba(0,0,0,0)',
// 		}, '=-.25');
// 	});
// }
// $('#alert-bar-close').click(function() {
// 	// console.log('clicked')
// 	$(this).parents('.alert_bar').hide();
// })

// function wrapWordsLetters(targetText) {
// 	const text = targetText.text(); // Get the raw text content
// 	let wordsWrappedHTML = '';
// 	const words = text.split(/\s+/);
// 	words.forEach((word, wordIndex) => {
// 		let charsWrappedInWord = '';
// 		// Wrap each character within the current word
// 		for (let i = 0; i < word.length; i++) {
// 			const char = word[i];
// 			charsWrappedInWord += `<span class="letter">${char}</span>`;
// 		}
// 		// Add the word-space inside the word span, at the end
// 		if (wordIndex < words.length - 1) { // Only add space if it's not the last word
// 			wordsWrappedHTML += `<span class="word">${charsWrappedInWord}<span class="word-space">&nbsp;</span></span>`;
// 		} else {
// 			wordsWrappedHTML += `<span class="word">${charsWrappedInWord}</span>`;
// 		}
// 	});
// 	// Replace the original h4 content with the new structured HTML
// 	targetText.html(wordsWrappedHTML);
// }
// $(document).ready(function() {
// 	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
// 		return;
// 	} else {
// 		scrollfunctions();
// 	}
