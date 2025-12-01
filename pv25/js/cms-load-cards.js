
$(document).ready(function() {

    $('[action="toggle-dropdown"').each(function() {
        $(this).click(function() {
            $(this).parent().toggleClass('open');
        })
    });


    function setLineClamp() {
        $('.session-text_content').each(function() {
            var $sessionTextContent = $(this);
            
            // Get the .session-headline element
            var $sessionHeadline = $sessionTextContent.find('.session-headline');
            
            if ($sessionHeadline.length) {
                // Get the number of lines the text flows on
                var lineHeight = parseInt($sessionHeadline.css('line-height'), 10);
                var height = $sessionHeadline.height();
                var numberOfLines = Math.round(height / lineHeight);
                console.log(lineHeight, height, numberOfLines)
                // Calculate the result (subtract from 7)
                var result = 7 - numberOfLines;
                
                // Get the .session-body child element
                var $sessionBody = $sessionTextContent.find('.session-body');
                
                if ($sessionBody.length) {
                    // Set the --webkit-line-clamp CSS property based on the result
                    var lineClampValue = result > 3 ? result : 3;
                    $sessionBody.css('--webkit-line-clamp', lineClampValue).css('flex-grow',0);
                }
            }
        });
}


    setLineClamp()


  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsload',
    (listInstances) => {
      console.log('cmsload Successfully loaded!');

      const [listInstance] = listInstances;

      //Code to run once after the Attribute loads goes here

      listInstance.on('renderitems', (renderedItems) => {
        console.log(renderedItems);
        setLineClamp()
      });
    },
  ]);

  window.fsAttributes.push([
  'cmsfilter',
  (filterInstances) => {
    console.log('cmsfilter Successfully loaded!');

    const [filterInstance] = filterInstances;

    filterInstance.listInstance.on('renderitems', (renderedItems) => {
      console.log(renderedItems, "cmsFilter");
      setTimeout(function() {setLineClamp()}, 50);
    });
  },
]);




});





