// Input group Component scripts -->
//// Input group password input actions -->
jQuery.fn.togglePasswordVisibility = function() {
  if($(this).val()) {
    $(this).attr('type', function(_, attr) { return attr == 'password' ? 'text' : 'password'; });
  }
};

jQuery.fn.togglePasswordIcon = function(to_inint = false) {
  if ($(this).attr('data-iconset')) {
    var iconset = $(this).attr('data-iconset').split(',');
    if (iconset.length > 1) {
      var used_icon = $('use', this).attr('xlink:href').split('#');
      if (!to_inint) {
        var change_icon = used_icon[1] == iconset[0] ? iconset[1]: iconset[0];
      } else {
        var change_icon = iconset[0];
      }
      $('use', this).attr('xlink:href', `${used_icon[0]}#${change_icon}`);
    }
  }
};

$(function() {
  $('.show-password').on('click', function() {
    if ($(this).hasClass('input-group-append') && $(this).prev().val()) {
      $(this).prev('input').togglePasswordVisibility();
      $('svg', this).togglePasswordIcon();
      $(this).parent().find('svg').not($('svg', this)).togglePasswordIcon();
    } else if ($(this).hasClass('input-group-prepend') && $(this).next().val()) {
      $(this).next('input').togglePasswordVisibility();
      $('svg', this).togglePasswordIcon();
      $(this).parent().find('svg').not($('svg', this)).togglePasswordIcon();
    }
  });
  $('.show-password').prev('input').on('change', function(){
    if(!$(this).val()) {
      $(this).next('.show-password').find('svg').togglePasswordIcon(true);
      $(this).attr('type', 'password');
    }
  });
  $('.show-password').next('input').on('change', function(){
    if(!$(this).val()) {
      $(this).prev('.show-password').find('svg').togglePasswordIcon(true);
      $(this).attr('type', 'password');
    }
  });
});
//// Input group password input actions <--
//// Input group card inputs actions -->
$(function() {
  var cardnumber_opts = {
    mask: [
      {
        mask: '0000 000000 00000',
        regex: '^3[47]\\d{0,13}',
        cardtype: 'american express'
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^(?:6011|65\\d{0,2}|64[4-9]\\d?)\\d{0,12}',
        cardtype: 'discover'
      },
      {
        mask: '0000 000000 0000',
        regex: '^3(?:0([0-5]|9)|[689]\\d?)\\d{0,11}',
        cardtype: 'diners'
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^(5[1-5]\\d{0,2}|22[2-9]\\d{0,1}|2[3-7]\\d{0,2})\\d{0,12}',
        cardtype: 'mastercard'
      },
      {
        mask: '0000-0000-0000-0000',
        regex: '^(5019|4175|4571)\\d{0,12}',
        cardtype: 'dankort'
      },
      {
        mask: '0000-0000-0000-0000',
        regex: '^63[7-9]\\d{0,13}',
        cardtype: 'instapayment'
      },
      {
        mask: '0000 000000 00000',
        regex: '^(?:2131|1800)\\d{0,11}',
        cardtype: 'jcb15'
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^(?:35\\d{0,2})\\d{0,12}',
        cardtype: 'jcb'
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^(?:5[0678]\\d{0,2}|6304|67\\d{0,2})\\d{0,12}',
        cardtype: 'maestro'
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^220[0-4]\\d{0,12}',
        cardtype: 'mir'
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^4\\d{0,15}',
        cardtype: 'visa'
      },
      {
        mask: '0000 0000 0000 0000',
        regex: '^62\\d{0,14}',
        cardtype: 'unionpay'
      },
      {
        mask: '0000 0000 0000 0000',
        cardtype: 'Unknown'
      }
   ],
   dispatch: function (appended, dynamicMasked) {
    var number = (dynamicMasked.value + appended).replace(/\D/g, '');

    for (var i = 0; i < dynamicMasked.compiledMasks.length; i++) {
        let re = new RegExp(dynamicMasked.compiledMasks[i].regex);
        if (number.match(re) != null) {
            return dynamicMasked.compiledMasks[i];
        }
    }
  }
  };

  $('.input-group_card .input-group_card__crd').each(function() {
    var cardnumber = this;
    var cardnumber_mask = new IMask(cardnumber, cardnumber_opts);

    cardnumber_mask.on("accept", function () {
      console.log(cardnumber_mask.masked.currentMask.cardtype);
    });
  
    cardnumber_mask.on('accept', function () {
      if (cardnumber_mask.value.length == 0) {    
      } else { 
      }
    });
  });

  $('.input-group_card .input-group_card__exp').each(function() {
    var expirationdate = this;

    var expirationdate_mask = new IMask(expirationdate, {
      mask: 'MM{/}YY',
      blocks: {
        YY: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 99,
        },
        MM: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
        },
      }
    });
  });
  
  $('.input-group_card .input-group_card__cvv').each(function() {
    var securitycode = this;

    var securitycode_mask = new IMask(securitycode, {
      mask: '0000',
    });
  });
});  
//// Input group card inputs actions <--
//// Input group number actions -->
$(function() {
  var number_inputs = [
    'input-group_number',
    'input-group_number_small',
    'input-group_number_large',
  ];

  for (var n in number_inputs) {
    var number = number_inputs[n];
    (function(nbr){
      $(`.${nbr} .input-group_number__control`).on('click', function(){
        var is_plus = $(this).next('.input-group_number__control').length;
        var this_input = $(`.${nbr}`).find('input');
        var this_value = $(`.${nbr}`).find('input').val();
        if (is_plus) {
          if (!this_value) {
            this_input.val(1);
          } else {
            this_input.val(parseInt(this_value) + 1);
          }
        } else {
          if (!this_value) {
            this_input.val(-1);
          } else {
            this_input.val(parseInt(this_value) - 1);
          }
        }
      });
    }(number))
  }
});
//// Input group number actions <--
// Input group Component scripts <--
