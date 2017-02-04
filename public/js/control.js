'use strict'



var current_view = "";
var current_cb = "";

$('.viewModeOption').click(function(){
  var state = $('#VRCheck');

  state.prop("checked",!state.prop("checked"));
  var stateCheck = $('#VRCheck').prop("checked");
  if(stateCheck){
    //the state is on
    $('.right').removeClass('single');
    $('.left').removeClass('fullWidth');
  }else{
    //turn the vr off
     $('.right').addClass('single');
     $('.left').addClass('fullWidth');

  }
});


var currentCB = 'normal';

$('.cbChoice').click(function(){
  $(this).addClass('selected');
  var choice = $(this).find('input');
  var temp_currentCB = choice.val();
  choice.prop("checked", !choice.prop("checked"));

  if(temp_currentCB != currentCB){
    $('#left_eye').removeClass(currentCB);
    $('#right_eye').removeClass(currentCB);
    $('#left_eye').addClass(temp_currentCB);
    $('#right_eye').addClass(temp_currentCB);
    currentCB = temp_currentCB;
  }
  $('input[name=cb]').each(function(){
      var state = $(this).prop("checked");
      if(state){

      }else{
        $(this).parent().removeClass('selected');
      }
  });
});



var rangeSlider = function(){
  var slider = $('.range-slider'),
      range = $('.range-slider__range'),
      value = $('.range-slider__value');

  slider.each(function(){

    value.each(function(){
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function(){
      $(this).next(value).html(this.value);
    });
  });
};

rangeSlider();
