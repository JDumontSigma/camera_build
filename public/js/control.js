'use strict'



var current_view = 'VR';

$('.viewModeOption').click(function(){
  $(this).addClass('selected');
  var option = $(this).find('input');
  var choice = option.val();
  if(choice !== current_view){
      option.prop('checked', !option.prop('checked'));
      current_view = choice;
      $('input[name=VR]').each(function(){
          var state = $(this).prop('checked');
          if(!state){
            $(this).parent().removeClass('selected');
          }
      });
  }
});
$('.viewModeOption').click(function(){
  var state = $('#VRCheck');

  state.prop('checked',!state.prop('checked'));
  var stateCheck = $('#VRCheck').prop('checked');
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


  if(temp_currentCB != currentCB){
    choice.prop('checked', !choice.prop('checked'));
    $('#left_eye').removeClass(currentCB);
    $('#right_eye').removeClass(currentCB);
    $('#left_eye').addClass(temp_currentCB);
    $('#right_eye').addClass(temp_currentCB);
    currentCB = temp_currentCB;
  }
  $('input[name=cb]').each(function(){
      var state = $(this).prop('checked');
      if(state){

      }else{
        $(this).parent().removeClass('selected');
      }
  });
});

var currentblur = 'none';

$('.blurriness .eye_choice').click(function(){
  $(this).addClass('selected');
  var choice = $(this).find('input');
  var temp_blur = choice.val();


  if(temp_blur !== currentblur){
    choice.prop('checked', !choice.prop('checked'));
    currentblur = temp_blur;
  }
  $('input[name=blur]').each(function(){
      var state = $(this).prop('checked');
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
