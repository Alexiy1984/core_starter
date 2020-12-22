// Pagination Component scripts -->
$(function() {
  var pagination_styles = [
    'pagination',
    'pagination_secondary',
    'pagination_dark',
  ];

  for (var p in pagination_styles) {
    var pagination = pagination_styles[p];
    (function(pgn){
      $(`.${pgn} .page-item`).not('.control, .disabled, .delimiter').on('click', function () {
        if ($(this).next().hasClass('control')) {
          $(this).prevAll(':visible:not(.control):not(.delimiter)').hide();
          $(this).prevAll().slice(1, 4).show();
          $(this).siblings('.page-item:not(.control)')
            .removeClass('active')
          $(this).not('.control')
            .addClass('active')
        } else {
          $(this).siblings('.page-item:not(.control)')
            .removeClass('active')
          $(this).not('.control')
            .addClass('active')
        }
      });

      $(`.${pgn} .page-item.control`).on('click', function () {
        var active_elt = $(this).parent().find('.page-item.active');
        if ($(this).attr('data-direction') === 'next' && !active_elt.next().hasClass('control')) {
          if (active_elt.next().is(':hidden')) {
            active_elt.prevAll('.page-item:not(.control)').slice(1).hide();
            active_elt.removeClass('active');
            active_elt.next().show().addClass('active');
          } else {
            if (active_elt.next().hasClass('delimiter')) {
              active_elt.removeClass('active').next().next().addClass('active');
            } else {
              active_elt.removeClass('active').next().addClass('active');
            }
          }
        }
    
        if ($(this).attr('data-direction') === 'prev' && !active_elt.prev().hasClass('control')) {
          if (active_elt.prev().is(':hidden')) {
            active_elt.nextAll(':visible').slice(1, 2).hide();
            active_elt.removeClass('active');
            active_elt.prev().show().addClass('active');
          } else {
            if (active_elt.prev().hasClass('delimiter')) {
              active_elt.removeClass('active').prev().prev().addClass('active');
            } else {
              active_elt.removeClass('active').prev().addClass('active');
            }
          }
        }    
      });
    }(pagination))
  }

  $('.pagination_short .page-item.control').on('click', function () {   
    if ($(this).attr('data-direction') === 'next') {
      var numbers = $(this).siblings('.counter').first().find('.page-link').text().split('/');

      numbers[0]++;
      if (numbers[0] <= numbers[1]) {
        $(this).siblings('.counter').first().find('.page-link').text(numbers[0] +'/'+numbers[1]);
      }
    };

    if ($(this).attr('data-direction') === 'prev') {
      var numbers = $(this).siblings('.counter').first().find('.page-link').text().split('/');

      numbers[0]--;
      if (numbers[0] >= 1) {
        $(this).siblings('.counter').first().find('.page-link').text(numbers[0] +'/'+numbers[1]);
      }
    };
  });
});
// Pagination Component scripts <--
