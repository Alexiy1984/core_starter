$(function() {
  $('.btn-group > * , .btn-group_primary > * ,.btn-group_success > * ,.btn-group_warning > * ,.btn-group_danger > * ,.btn-group_colorfull > * ')
  .on('click', function () {
    if (!$(this).hasClass('button_disabled') && !$(this).hasClass('disabled')) {
      $(this).toggleClass('selected');
      $(this).siblings().removeClass('selected');
    }
  })
});
