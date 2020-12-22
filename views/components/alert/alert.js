jQuery.fn.show_alert = function() {
  $(this).removeClass('hide');
  $(this).addClass('show');
};

jQuery.fn.hide_alert = function() {
  $(this).removeClass('show');
  $(this).addClass('hide');
};

$(function() {
  var i = 0;
  var buttons = [
    'alert',
    'alert_success',
    'alert_warning',
    'alert_danger',
    'alert_large',
    'alert_large_success',
    'alert_large_warning',
    'alert_large_danger',
  ];
  $('.button_primary').on('click', function() {
    $(`.${buttons[i - 1]}`).hide_alert();
    $(`.${buttons[i]}`).show_alert();
    if (i > 7) {
      i = 1; 
      $(`.${buttons[7]}`).hide_alert(); 
      $(`.${buttons[0]}`).show_alert(); 
    } else {
      i++;
    }
  });

  $('.alert, .alert_success, .alert_warning, .alert_danger').on('click', function() {
    $(this).hide_alert();
  });
  
  $('.alert__close').on('click', function() {
    $(this).parent().hide_alert();
  }) 
});
