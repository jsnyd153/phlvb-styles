//Dependancies: blocks/basic_hero/css/index.css


const characterInterval = 50;// time between each letter (in ms)
const textReadingTime = 2000;// time full word is displayed (in ms)
const textRestTime = 1500;// time when blank betweeen words (in ms)
const blinkTiming = textReadingTime / 3.5; // timing for the blink animation (in ms) (cycles while full word is complete) 


function initiateAnimation(textList, textListContainer) {
  let currentIndex = 0;
  //get content from the original span elements and add them to an array
  //use these for the text content in the animation
  const textArrayElements = Array.from(textList.querySelectorAll('span'));
  const textArrays = textArrayElements.map(span => span.textContent);

  function typingAnimation() {
    //typing animation adding characters one by one
    const currentText = textArrays[currentIndex];
    let i = 0;
    //  No blinking indicator while letters are added
    textListContainer.classList.remove('blinking');
    textList.textContent = ''; // Remove initial content from span

    const typingInterval = setInterval(() => {
      // Add current character
      textList.textContent += currentText[i];
      //if there are no more characters to add, after a delay start removing characters
      //make the indicator blink while waiting
      if (i === currentText.length - 1) {
        //when out of letters to add, make indicator blink, and after delay, start erase function
        textListContainer.classList.add('blinking');
        clearInterval(typingInterval);
        setTimeout(() => eraseAnimation(), textReadingTime);
      }
      //if there are still more characters move to the next character
      i++;
    }, characterInterval);
  }

  function eraseAnimation() {
    //  No blinking indicator while letters are added
    textListContainer.classList.remove('blinking');
    const currentText = textArrays[currentIndex];
    let i = currentText.length - 1;

    const eraseInterval = setInterval(() => {
      textList.textContent = currentText.substring(0, i);
      if (i === 0) {
      //if there are no more characters to add, after a delay start typing new characters
      //make the indicator blink while waiting
        textListContainer.classList.add('blinking');
        clearInterval(eraseInterval);
        setTimeout(() => {
          //move to the item in the array with the original type pulled form the page 
          //or loop back the first if the current item is hte last one
          currentIndex = (currentIndex + 1) % textArrays.length;
          typingAnimation();
        }, textRestTime);
      }
      //if there are still more characters move to the next one
      i--;
    }, characterInterval);
  }

  // Start the typing animation
  typingAnimation();
}

// Apply animation to each [animation="typewriter"] element
const typewriterElements = document.querySelectorAll('[animation="typewriter"]');
typewriterElements.forEach(element => {
  initiateAnimation(element.querySelector('.textList'), element);
  //set blink animation timing based on variables use for this function's timing
  element.style.setProperty("--blinkTiming", blinkTiming + 'ms');
});
