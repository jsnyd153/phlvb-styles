$(document).ready(function() {
    var $richText = $('.session_content--body_text .w-richtext');
    
    // Check if the content has overflow
    if ($richText[0].scrollHeight > $richText[0].clientHeight) {
        console.log('The .w-richtext element has overflow');
    } else {
        console.log('The .w-richtext element does not have overflow');
    }
});
