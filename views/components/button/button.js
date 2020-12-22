// Button Component scripts -->
$(function() {
  var btn_groups = [
    'btn-group',
    'btn-group_primary',
    'btn-group_success',
    'btn-group_warning',
    'btn-group_danger',
    'btn-group_colorfull'
  ];

  for (var bg in btn_groups) {
    var btn_group = btn_groups[bg];
    (function(btng){
      $(`.${btng}:not([data-toggle="multiple"]) > *`).on('click', function(){
        if (!$(this).hasClass('button_disabled') && !$(this).hasClass('disabled')) {
          $(this).toggleClass('selected');
          $(this).siblings().removeClass('selected');
        }
      });
      $(`.${btng}[data-toggle="multiple"] > *`).on('click', function(){
        if (!$(this).hasClass('button_disabled') && !$(this).hasClass('disabled')) {
          $(this).toggleClass('selected');
        }
      });
    }(btn_group))
  }

  // $('.btn-group > * , .btn-group_primary > * ,.btn-group_success > * ,.btn-group_warning > * ,.btn-group_danger > * ,.btn-group_colorfull > * ')
  // .on('click', function () {
  //   if (!$(this).hasClass('button_disabled') && !$(this).hasClass('disabled')) {
  //     $(this).toggleClass('selected');
  //     $(this).siblings().removeClass('selected');
  //   }
  // });
});
// Button Component scripts <--
