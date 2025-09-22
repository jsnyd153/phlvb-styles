//Content Grid Fix

$(document).ready(function(){
    const contentGridComponent = $('.content_grid:not([grid-behavior="scroll"])');
    if(contentGridComponent.length > 0){
        contentGridComponent.each(function(){
            const thisComponent = $(this);
            itemsPerRow = thisComponent.attr('items-per-row');
            numberOfItems = thisComponent.children().length;

            if (itemsPerRow > numberOfItems){
                newItemsVolume = itemsPerRow - numberOfItems;
                for (let i = 0; i < newItemsVolume; i++) {
                    $(thisComponent).append('<div class="clear"></div>');
                }
                thisComponent.css('row-gap','0');
            }

        });
    }
})