console.log('hover')

function addBrandHover() {
	const brandHoverCards = $('.sponsor_grid-item, .person-card, .session_list-item, .card[card-type="event-page"], .past_event-card');
	if (brandHoverCards.length > 0) {
		brandHoverCards.each(function() {
			const $item = $(this); // Cache the jQuery object for the current item
			const initialGoldColor = getComputedStyle($item[0]).getPropertyValue('--_gold');
			$item.on('mouseenter', function() {
				gsap.killTweensOf(this);
				gsap.to(this, {
					duration: 0.5,
					'--_gold': 'rgba(254, 165, 57, 1)',
					'--_red': 'rgba(246, 65, 92, 1)',
					'--_blue': 'rgba(97, 123, 238, 1)',
					'--_logo-opacity': '1',
					'--_glow-opacity': '1',
					ease: "power4.out"
				});
				// Attach mouseleave event listener for hover-out animation
				$item.on('mouseleave', function() {
					gsap.killTweensOf(this);
					gsap.to(this, {
						duration: 2,
						delay: .1,
						'--_gold': initialGoldColor,
						'--_red': initialGoldColor,
						'--_blue': initialGoldColor,
						'--_logo-opacity': '.9',
						'--_glow-opacity': '0',
						ease: "power4.out"
					});
				});
			});
		})
	}
}
function addNOLAHover() {
	const brandHoverCards = $('.home--link[href="/new-orleans"]');
	if (brandHoverCards.length > 0) {
		brandHoverCards.each(function() {
			const $item = $(this); // Cache the jQuery object for the current item
			const initialGoldColor = getComputedStyle($item[0]).getPropertyValue('--_gold');
			$item.on('mouseenter', function() {
				gsap.killTweensOf(this);
				gsap.to(this, {
					duration: 0.5,
					'--_gold': 'rgb(126, 24, 250)',
					'--_red': 'rgb(152, 59, 233)',
					'--_blue': 'rgb(108, 222, 142)',
					'--_logo-opacity': '1',
					// '--_glow-opacity': '1',
					ease: "power4.out"
				});
				// Attach mouseleave event listener for hover-out animation
				$item.on('mouseleave', function() {
					gsap.killTweensOf(this);
					gsap.to(this, {
						duration: 2,
						delay: .1,
						'--_gold': initialGoldColor,
						'--_red': initialGoldColor,
						'--_blue': initialGoldColor,
						'--_logo-opacity': '.9',
						'--_glow-opacity': '0',
						ease: "power4.out"
					});
				});
			});
		})
	}
}
function addLNDHover() {
	const brandHoverCards = $('.home--link[href="/london"]');
	if (brandHoverCards.length > 0) {
		brandHoverCards.each(function() {
			const $item = $(this); // Cache the jQuery object for the current item
			const initialGoldColor = getComputedStyle($item[0]).getPropertyValue('--_gold');
			$item.on('mouseenter', function() {
				gsap.killTweensOf(this);
				gsap.to(this, {
					duration: 0.5,
					'--_gold': 'rgb(10, 221, 254)',
					'--_red': 'rgb(79, 140, 255)',
					'--_blue': 'rgb(53, 57, 255)',
					'--_logo-opacity': '1',
					// '--_glow-opacity': '1',
					ease: "power4.out"
				});
				// Attach mouseleave event listener for hover-out animation
				$item.on('mouseleave', function() {
					gsap.killTweensOf(this);
					gsap.to(this, {
						duration: 2,
						delay: .1,
						'--_gold': initialGoldColor,
						'--_red': initialGoldColor,
						'--_blue': initialGoldColor,
						'--_logo-opacity': '.9',
						'--_glow-opacity': '0',
						ease: "power4.out"
					});
				});
			});
		})
	}
}
function addBNGHover() {
	const brandHoverCards = $('.home--link[href="/bengaluru"]');
	if (brandHoverCards.length > 0) {
		brandHoverCards.each(function() {
			const $item = $(this); // Cache the jQuery object for the current item
			const initialGoldColor = getComputedStyle($item[0]).getPropertyValue('--_gold');
			$item.on('mouseenter', function() {
				gsap.killTweensOf(this);
				gsap.to(this, {
					duration: 0.5,
					'--_gold': 'rgb(234, 101, 77)',
					'--_red': 'rgb(245, 194, 127)',
					'--_blue': 'rgb(254, 162, 55)',
					// '--_logo-opacity': '1',
					// '--_glow-opacity': '1',
					ease: "power4.out"
				});
				// Attach mouseleave event listener for hover-out animation
				$item.on('mouseleave', function() {
					gsap.killTweensOf(this);
					gsap.to(this, {
						duration: 2,
						delay: .1,
						'--_gold': initialGoldColor,
						'--_red': initialGoldColor,
						'--_blue': initialGoldColor,
						// '--_logo-opacity': '.9',
						// '--_glow-opacity': '0',
						ease: "power4.out"
					});
				});
			});
		})
	}
}
$(document).ready(function() {
	addBrandHover();
    addNOLAHover();
    addLNDHover();
    addBNGHover();
})