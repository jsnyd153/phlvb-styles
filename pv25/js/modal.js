// // Function to handle modal trigger click
// // console.log('modal.js loaded');
// function handleModalTriggerClick(event) {
//   const modalName = $(this).attr("modal-trigger");
//   const speakerName = $(this).attr("speaker-data");
//   const modalDialog = $(`[modal-dialog="${modalName}"]`);
//   // console.log('handleModalTriggerClick', modalDialog);
//   if (modalDialog.length > 0) {
//     // console.log('modalDialog.length > 0');
//     if(speakerName){
//     updateSpeakerModal(speakerName);
//     }

//     modalDialog[0].showModal();
//   }
// }

// function handleModalCloseClick(event) {
//   if ($(this).attr("modal-close") === "parent") {
//     // Find the parent dialog element and close it
//     const parentDialog = $(this).closest("dialog");
//     if (parentDialog.length > 0) {
//       parentDialog[0].close();
//     }
//   }
// }

//       document.addEventListener('DOMContentLoaded', () => {
//             const modal = document.querySelector('.speaker_modal-modal');
//             const content = document.querySelector('.speaker_modal-content');

//             if (modal) {
//                 modal.addEventListener('click', (event) => {
//                     // Check if the click target is exactly the modal element itself
           
//                     if (event.target === modal || !content.contains(event.target)) {
//                         // console.log("close");
//                         // In a real application, you would typically hide the modal here:
//                         // modal.style.display = 'none';
//                     }
//                 });
//             }

//             // Optional: To make it easier to test, you might have a button to toggle visibility
//             // For this example, the modal is always visible initially.
//         });



//   function updateSpeakerModal(speakerName){
//     const contents =  $(`[speaker-data="${speakerName}"]`);
//     const modalContainer = $('.speaker_modal-modal');

//     const headshotData = contents.find('.person-headshot').attr('src');
//     const headshotSetData = contents.find('.person-headshot').attr('srcset');
//     const headshotAltData = contents.find('.person-headshot').attr('alt');
//     const nameData = contents.find('.person-name').text();
//     const companyData = contents.find('.person-company').text();
//     const companyLinkData = contents.find('[person-link]').attr('person-link');
//     const titleData = contents.find('.person-title').text();
//     const bioData = contents.find('.person-description').html();
//     const twitterData =  contents.find('.person-twitter-handle').text();
//     const linkedinData = contents.find('.person-linkedin-handle').text();

//     // console.log(twitterData, linkedinData)

//     const headshotEl = modalContainer.find('.speaker_modal-speaker img');
//     if(headshotData.length > 0){
//       // console.log(headshotData, headshotEl, headshotSetData)
//       headshotEl.show().attr('src', headshotData).attr('srcset',headshotData).attr('alt',headshotAltData);
//       if( headshotSetData){
//         headshotEl.attr('srcset',headshotSetData);
//       }
    
//     }else{
//       headshotEl.hide()
//     }

//     const nameEl = modalContainer.find('[data-element="speaker-name"]');
//     if(nameData.length > 0){
//       nameEl.show().text(nameData);
//     }else{
//       nameEl.hide()
//     }

//     const companyEl = modalContainer.find('[data-element="speaker-company"]');
//     if(companyData.length > 0){
//       // console.log('companyData.length > 0', companyLinkData)
//       companyEl.show().text(companyData).attr('href',companyLinkData);
//     } else{
//       companyEl.hide()
//     }

//     const titleEl = modalContainer.find('[data-element="speaker-title"]');
//     if(titleData.length > 0){
//       titleEl.show().text(titleData);
//     }else{
//       titleEl.hide()
//     }
//     const twitterLink = modalContainer.find('[data-element="speaker-twitter-link"');
//     // console.log(twitterData)
//     // console.log(typeof twitterData);
//     if(twitterData !== 'null'){
//       const twitterHref = "https://x.com/" + twitterData;
//       twitterLink.show().attr('href',twitterHref);
//     } else{
//      twitterLink.hide(); 
//     }

//     const linkedinLink = modalContainer.find('[data-element="speaker-linkedin-link"');
//     if(linkedinData != 'null'){
//       const linkedinHref = "https://www.linkedin.com/in/" + linkedinData;
//       linkedinLink.show().attr('href',linkedinHref);
//     } else{
//      linkedinLink.hide(); 
//     }

//     const linksEl = modalContainer.find('.speaker_modal-details-row:has(.speaker_modal-social_links)');
//     if(linkedinData != 'null' && twitterLink != 'null' ){

//     }
//     else{
//       linksEl.hide(); 
//     }

//     const descriptionEl = modalContainer.find('[data-element="speaker-description"');
//     if(bioData.length > 0){
//       descriptionEl.show().html(bioData);
//     } else{
//      descriptionEl.hide(); 
//     }

  
//   }


// $("[modal-trigger]").click(handleModalTriggerClick);
// $(document).on("click", '[modal-close="parent"]', handleModalCloseClick); 