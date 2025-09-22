function scrollfunctions() {
	gsap.registerPlugin(ScrollTrigger);


$('[scroll-animation="count-up"]').each(function(){
    const scrollTarget = $(this);
	    const scrollTargetNumber = $(this).find('.digits');
    const scrollTargetHeader = $(this).find('.stat_feature--number');

    //store value and the number of digits to use for animation
    let endValue = $(scrollTargetNumber).text();
    let timing = endValue.length;
    //set initial display value to 0
    $(scrollTargetNumber).text('0');
	gsap.set(scrollTarget, {opacity: 0});


  ScrollTrigger.create({
		trigger:  scrollTarget, 
		start: "top 70%", 
		once:true,
		scrub: true,  
		// //markers:true,
		onEnter: function() { 
      gsap.to(scrollTarget, { opacity: 1,  duration: .3,stagger: 0.3, });
      $(scrollTargetNumber).prop('Counter',0).animate({
            Counter: endValue
        }, {
            duration: timing * 1000,
            easing: 'swing',
            step: function (now) {
                $(scrollTargetNumber).text(Math.ceil(now));
            }
        });
		},    
	});
})



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

