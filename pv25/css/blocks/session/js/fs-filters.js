$(document).ready(function() {
    $('[action="toggle-dropdown"').each(function() {
        $(this).click(function() {
            $(this).parent().toggleClass('open');
        })
    });


});


