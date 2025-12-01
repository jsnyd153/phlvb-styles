$(document).ready(function(){
    console.log('headlinersjs')
    $('.headliners--item:nth-child(1)').each(function(){
        const imageSrc = $(this).find('img').attr('src');
        const imageSrcset = $(this).find('img').attr('srcset');
        const mediaEl = $(this).parents('.headliners--section').find('.headliners--media img')
        $(this).attr('focus',true);
        mediaEl.attr('src',imageSrc).attr('srcset', imageSrcset);

    })

    $('.headliners--item').each(function(){
        const thisEl = $(this);
        const imageSrc = $(this).find('img').attr('src');
        const imageSrcset = $(this).find('img').attr('srcset');
        const mediaEl = $(this).parents('.headliners--section').find('.headliners--media img')
        $(this).hover(function(){
             mediaEl.attr('src',imageSrc).attr('srcset', imageSrcset);
             thisEl.siblings().attr('focus',false);
             thisEl.attr('focus',true);
        })
    });
});


