$(document).ready(function(){



$('.people_slider--section').each(function () {
    const section = $(this);
    const portraitSlider = $(this).find('.people_slider--portraits-wrapper');
    const namesSlider = $(this).find('.people_slider--names-wrapper');
    const nextButton = section.find('.people_slider--next');
    const prevButton = section.find('.people_slider--prev');


        if (!portraitSlider.length || !namesSlider.length || !nextButton.length || !prevButton.length) {
            console.warn("Swiper initialization skipped: Missing one or more required elements in section:", section);
            return; // Skip this section if elements are missing
        }

    var peoplePortraitSwiper = new Swiper(portraitSlider[0], {
      slidesPerView: 1,
      spaceBetween: 24,
      keyboard: true,
      loop: false,
      speed: 600,
      mousewheel:{forceToAxis:true,},
      
      navigation: {
        prevEl: prevButton[0],
        nextEl: nextButton[0],
      },
    }); //build swiper

    var peopleNamesSwiper = new Swiper(namesSlider[0], {
      slidesPerView: 1,
      spaceBetween: 24,
      keyboard: true,
      loop: false,
      speed: 600,
      effect:'fade'
      
    }); //build swiper

       peoplePortraitSwiper.controller.control = peopleNamesSwiper;
        peopleNamesSwiper.controller.control = peoplePortraitSwiper;

});


const wrappedText = $('.people_slider--names-item h4').each(function(){
         const targetText = $(this);
        const text = targetText.text(); // Get the raw text content

        let wordsWrappedHTML = '';
        const words = text.split(/\s+/);

        words.forEach((word, wordIndex) => {
            let charsWrappedInWord = '';

            // Handle empty strings from split (e.g., if there were multiple spaces)
            if (word.length === 0) {
                if (wordIndex < words.length - 1) { // Don't add trailing space if it was the last "word"
                     wordsWrappedHTML += `<span class="word-space">&nbsp;</span>`;
                }
                return;
            }

            // Wrap each character within the current word
            for (let i = 0; i < word.length; i++) {
                const char = word[i];
                charsWrappedInWord += `<span>${char}</span>`;
            }
            wordsWrappedHTML += `<span class="word">${charsWrappedInWord}</span>`;

            if (wordIndex < words.length - 1) {
                wordsWrappedHTML += `<span class="word-space">&nbsp;</span>`;
            }
        });

        // Replace the original h4 content with the new structured HTML
        targetText.html(wordsWrappedHTML);
});

});
