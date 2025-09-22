
$(document).ready(function() {

    let eventName = $('body').attr('for-event');

    if (eventName) {
        $('[conditional-display]').each(function(){
            let condition = $(this).attr('conditional-display');
            if (eventName ==! condition){
                $(this).remove();
            }
        })
    }

});


// style


// [for-evnent="london"] .link[for-evnent="london"]{
//     order: 1;
// }
// [for-evnent="bengaluru"] .link[for-evnent="bengaluru"]{
//     order: 1;
// }
// [for-evnent="austin"] .link[for-evnent="austin"]{
//     order: 1;
// }
// [for-evnent="new-orleans"] .link[for-evnent="new-orleans"]{
//     order: 1;
// }

// [for-evnent="london"] .link[for-evnent="london"]{
//     backround:$cream;
//      color:$sea-foam;
// }
// [for-evnent="bengaluru"] .link[for-evnent="bengaluru"]{
//     order: 1;
// }
// [for-evnent="austin"] .link[for-evnent="austin"]{
//     order: 1;
// }
// [for-evnent="new-orleans"] .link[for-evnent="new-orleans"]{
//     order: 1;
// }