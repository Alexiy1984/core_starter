// Inner script not for main build
$(function() {
  var text = '';
  $('#select').text($('.btn-group_success .button.selected').first().text());
  $('.btn-group_primary[data-toggle="multiple"] .button.selected').each(function(){
    text += $(this).text() + ' ';
  });

  $('#multiple').text(text);
});

