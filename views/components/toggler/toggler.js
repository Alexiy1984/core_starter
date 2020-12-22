$(function() {
  var togglers = [
    'toggler',
    'toggler_secondary',
    'toggler_dark',
  ];

  for (var t in togglers) {
    var toggler = togglers[t];
    (function(tgl){
      $(`.${tgl}`).on('click', function(){
        $(this).toggleClass('active');
      });
    }(toggler))
  }
});

