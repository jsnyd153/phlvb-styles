
$(window).on('scroll', function() {
  checkStickyPosition();
});

function checkStickyPosition() {
  const $navBar = $('.dsa_nav--bar');
  
  // Get the computed style for the 'top' property
  const navBarTop = parseInt($navBar.css('top'), 10) || 0;
  
  // Get the position of the navbar relative to the viewport
  const navBarOffset = $navBar.offset().top;
  const scrollPosition = $(window).scrollTop();
  
  // Determine the active sticky condition
  if (scrollPosition >= (navBarOffset - navBarTop)) {
      console.log('The navbar is sticky.');
      // You can add any additional logic here
      $navBar.attr('stuck', true);
  } else {
    // $navBar.attr('stuck', false);
    $navBar.removeAttr('stuck');
  }
}
