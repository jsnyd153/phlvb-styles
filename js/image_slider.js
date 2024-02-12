$('[media-type="image-slider"]').each(function (index, element) {
	var $this = $(this);
	var $timeModifier = index * 500;
	var $Speed = 1000;
	var $Timer = 5000 + $timeModifier;
	$this.find(".image_slider").addClass("image_slider-" + index);
	$this
		.parents(".media_area")
		.find(".swiper-pagination")
		.addClass("swiper-pagination-" + index);

	var swiper = new Swiper(".image_slider-" + index, {
		// your settings ...

		mousewheel: {
			forceToAxis: true,
		},
		speed: $Speed,
		autoplay: {
			delay: $Timer,
		},
		loop: true,
		longSwipesRatio: 0.01,
		followFinger: false,
		grabCursor: true,
		watchSlidesProgress: true,
		lazy: {
			loadPrevNext: true,
		},

		pagination: {
			el: ".swiper-pagination-" + index,
			clickable: true,
		},
	});
});
