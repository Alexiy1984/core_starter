// DropdownComponent scripts -->
$(function() {
  var dropdowns = [
    'dropdown',
    'dropdown_small',
    'dropdown_large',
  ];

  for (var d in dropdowns) {
    var dropdown = dropdowns[d];
    (function(dpn){
      $(`.${dpn} .dropdown-item`).on('click', function(e) {
        e.stopPropagation();
        var this_value = $(this).html();
    
        if ($(this).find('input[type=checkbox]').length) {
          if(e.currentTarget === this && $(e.target).prop('type') !== 'checkbox') {
            $(this).find('input[type=checkbox]').prop('checked', function(_, attr) {
              return attr == true ? false : true;
            });
          } else {
            $(e.target).prop('checked', function(_, attr) {
              return attr == true ? false : true;
            });
          };
        } else if ($(this).find('input[type=radio]').length) {
          $(this).find('input[type=radio]').prop('checked', function(_, attr) {
            return attr == true ? false : true;
          });
        } else {
          $(this).parents(`.${dpn}`).find('.dropdown-toggle').html(this_value);
          $(this).parents(`.${dpn}`).dropdown('toggle');
        }
      });
    }(dropdown))
  }
});
// DropdownComponent scripts <--
