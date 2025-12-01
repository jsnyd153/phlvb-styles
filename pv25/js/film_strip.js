$(document).ready(function(){



    let addMmotion;

    if (!window.matchMedia("(preferås-reduced-motion: reduce)").matches) {
    addMmotion = true;
    }

    $('.film_strip--row').each(function(){
        //find the row
        const row = $(this);
        //set the attribute to true if we have 

       if(addMmotion){
           row.attr('film-animation','true');
        }
        //get the wrapper
        const wrapper = row.find('.film_strip--wrapper');
        //get list props
        const listMediaType = row.find('.film_strip--list').attr('media-type');
        const listDirection = row.find('.film_strip--list').attr('direction');
        const listFade = row.find('.film_strip--list').attr('fade');
        //get each item
        const items = row.find('.film_strip--item');
        // empty the wrapper
        wrapper.empty();
        // create list witth needed attributes
        const listObj = $('<div>').addClass('film_strip--list w-dyn-items').attr('role','list')
        // Clone items wih aria hidden
        const hiddenItems = items.clone().attr('aria-hidden', 'true');
        //add the items to the list
        listObj.append(items)
        if(addMmotion){
            listObj.append(hiddenItems);
        }
        wrapper.append(listObj)
        const newItems = wrapper.find('.film_strip--item');
        const newList = wrapper.find('.film_strip--list');
        newList.css('--_scroll-items',newItems.length);
        if(listMediaType.length > 0){
             newList.attr('media-type',listMediaType);
        }
        if(listDirection.length > 0){
             newList.attr('direction',listDirection);
        }
        if(listFade.length > 0){
             newList.attr('fade',listFade);
        }
    })
});