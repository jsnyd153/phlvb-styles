
$(document).ready(function() {


    $('[select-type="checkbox"]').each(function() {

        let targetSelect = $(this);
        let targetName = targetSelect.attr('name');
        let selectList = $('<ul class="multi-select-input" id="'+ targetName + '-input"></ul>');
        let inputContainer = targetSelect.parents('.input_area');
        
        $(targetSelect).css('display','none');
        $(inputContainer).css('flex','auto');
        console.log(this);
        $(inputContainer).append(selectList);

        $(targetSelect).find('option').each(function() {
            var optionValue = $(this).val();
            var optionText = $(this).text();
            
            // Skip the placeholder option (empty value)
            if (optionValue) {
              var li = $('<li data-value="' + optionValue + '"class="checkbox-group-item" ><div class="checkbox-display"></div><span class="w-form-label">' + optionText + '</span></li>');
              selectList.append(li);
            }
          });
            // Handle <li> click events to select/deselect options
            $('#'+ targetName + '-input li').click(function() {
                var li = $(this);
                var value = li.data('value');
                var selectElement = targetSelect;
                
                // Toggle selection in the <select> element
                if (li.hasClass('selected')) {
                // Deselect the option if it's already selected
                li.removeClass('selected');
                selectElement.find('option[value="' + value + '"]').prop('selected', false);
                } else {
                // Select the option if it's not selected
                li.addClass('selected');
                selectElement.find('option[value="' + value + '"]').prop('selected', true);
                }
                
                // Trigger change event on <select> to update the form's state if needed
                selectElement.trigger('change');
            });

     // Optionally, sync the <li> selection state with the <select> element's state
    // $(targetSelect).on('change', function() {
    //     $('#'+ targetName + '-input li').each(function() {
    //       var li = $(this);
    //       var value = li.data('value');
    //       if ($('#field option[value="' + value + '"]').prop('selected')) {
    //         li.attr('selected','true');
    //       } else {
    //         li.attr('selected','false');
    //       }
    //     });
    //   });
    });//each checkbox
  });
  


$(document).ready(function() {


  $('[select-type="radio"]').each(function() {

      let targetSelect = $(this);
      let targetName = targetSelect.attr('name');
      let selectList = $('<ul class="multi-select-input" id="'+ targetName + '-input"></ul>');
      let inputContainer = targetSelect.parents('.input_area');
      
      $(targetSelect).css('display','none');
      $(inputContainer).css('flex','auto');
      console.log(this);
      $(inputContainer).append(selectList);

      $(targetSelect).find('option').each(function() {
          var optionValue = $(this).val();
          var optionText = $(this).text();
          
          // Skip the placeholder option (empty value)
          if (optionValue) {
            var li = $('<li data-value="' + optionValue + '"class="radio-group-item" ><div class="radio-display"></div><span class="w-form-label">' + optionText + '</span></li>');
            selectList.append(li);
          }
        });
          // Handle <li> click events to select/deselect options
          $('#'+ targetName + '-input li').click(function() {
              var li = $(this);
              var value = li.data('value');
              var selectElement = targetSelect;
              
              // Toggle selection in the <select> element
              if (li.hasClass('selected')) {
              // Deselect the option if it's already selected
              li.removeClass('selected');
              selectElement.find('option[value="' + value + '"]').prop('selected', false);
              } else {
              // Select the option if it's not selected
              li.addClass('selected');
              selectElement.find('option[value="' + value + '"]').prop('selected', true);
              }
              
              // Trigger change event on <select> to update the form's state if needed
              selectElement.trigger('change');
          });

  });//each checkbox
});
