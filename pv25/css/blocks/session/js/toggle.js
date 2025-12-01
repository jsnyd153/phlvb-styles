$(document).ready(function() {


    $('[action="view-slides"]').attr('aria-expanded','false');
    $('#slide-display').attr('aria-hidden','true');
    $('.session_content--description').attr('expanded','false');


  $('[action="view-slides"]').on('click', function() {
    // Toggle the aria-expanded attribute on the clicked element
    $(this).toggleAttr('aria-expanded');
    
    // Get the id from the aria-controls attribute
    var controlsId = $(this).attr('aria-controls');
    
    // Find the element with that id and toggle the aria-expanded attribute
    $('#' + controlsId).toggleAttr('aria-hidden');
  });
});


$('[action="toggle-body"]').on('click', function() {
    // Toggle the aria-expanded attribute on the clicked element
    

    var targetBody = $(this).parents('.session_content--description');

    var $this = $(this);
    $(targetBody).toggleAttr('expanded');
    
    var currentValue = $(this).parents('.session_content--description').attr('expanded');
    if (currentValue === 'true') {
        $this.find('.button-text').html('show less')
        console.log('true')
      } else {
        console.log('false')
        $this.find('.button-text').html('show more')
      }
  });

// jQuery to toggle an attribute
$.fn.toggleAttr = function(attr) {
  return this.each(function() {
    var $this = $(this);
    var currentValue = $this.attr(attr);
    if (currentValue === 'true') {
      $this.attr(attr, 'false');
    } else {
      $this.attr(attr, 'true');
    }
  });
};





$(document).ready(function() {
  var $richText = $('.session_content--body_text .w-richtext');
  // Check if the content has overflow


  if ($richText[0].scrollHeight <= $richText[0].clientHeight) {
    $('.session_content--description .button-container').css('display','none');
    $('.session_content--description .session_content--body_text').css('mask-image','none').css('grid-template-rows','1fr');
} else {
    // console.log('The .w-richtext element has overflow');
    return;
}


});
