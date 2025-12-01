$(document).ready(function() {


  const videoBackground = $('.w-background-video-atom');

  if( videoBackground.length > 0){
    videoBackground.each(function(){
      thisEl = $(this);
        const mediaContaitner = thisEl.parents('.media_content');
        const playButton = mediaContaitner.find('.video-play-button');
        const pauseButton = mediaContaitner.find('.video-pause-button');
        const video = mediaContaitner.find('video')[0];

      // Function to play the video and show/hide buttons
      function playVideo() {
        video.play();
        pauseButton.show();
        playButton.hide();
      }

      // Function to pause the video and show/hide buttons
      function pauseVideo() {
        video.pause();
        playButton.show();
        pauseButton.hide();
      }

      // On load, check for reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        pauseVideo(); // Pause the video
      } else {
        playVideo(); // Autoplay if no reduced motion
      }

      // Click handler for the pause button
      pauseButton.on('click', function() {
        pauseVideo();
      });

      // Click handler for the play button
      playButton.on('click', function() {
        playVideo();
      });

    });
  }








});