

'use strict';

var videoElement = document.querySelector('video');
var leftEye = document.getElementById('left_eye');
var rightEye = document.getElementById('right_eye');
var audioInputSelect = document.querySelector('select#audioSource');
var audioOutputSelect = document.querySelector('select#audioOutput');
var videoSelect = document.querySelector('select#videoSource');
var selectors = [audioInputSelect, audioOutputSelect, videoSelect];
var rearCameraVal;


function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  var values = selectors.map(function(select) {
    return select.value;
  });
  selectors.forEach(function(select) {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
    var option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'audioinput') {
      option.text = deviceInfo.label ||
          'microphone ' + (audioInputSelect.length + 1);
      audioInputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'audiooutput') {
      option.text = deviceInfo.label || 'speaker ' +
          (audioOutputSelect.length + 1);
      audioOutputSelect.appendChild(option);
    } else if (deviceInfo.kind === 'videoinput') {
      var str = deviceInfo.label;

      if(str.indexOf('back') != -1){
        rearCameraVal = deviceInfo.deviceId;
      }


      option.text = deviceInfo.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach(function(select, selectorIndex) {
    if (Array.prototype.slice.call(select.childNodes).some(function(n) {
      return n.value === values[selectorIndex];
    })) {
      select.value = values[selectorIndex];
    }
  });

}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

// Attach audio output device to video element using device/sink ID.
function attachSinkId(element, sinkId) {
  if (typeof element.sinkId !== 'undefined') {
    element.setSinkId(sinkId)
    .then(function() {
      console.log('Success, audio output device attached: ' + sinkId);
    })
    .catch(function(error) {
      var errorMessage = error;
      if (error.name === 'SecurityError') {
        errorMessage = 'You need to use HTTPS for selecting audio output ' +
            'device: ' + error;
      }
      console.error(errorMessage);
      // Jump back to first output device in the list as it's the default.
      audioOutputSelect.selectedIndex = 0;
    });
  } else {
    console.warn('Browser does not support output device selection.');
  }
}

function changeAudioDestination() {
  var audioDestination = audioOutputSelect.value;
  attachSinkId(videoElement, audioDestination);
}

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  //videoElement.srcObject = stream;
  rightEye.srcObject = stream;
  leftEye.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}


function start() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  var audioSource = audioInputSelect.value;
  var videoSource = videoSelect.value;


  var constraints = {
    audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(gotStream).then(gotDevices).catch(handleError);


}

audioInputSelect.onchange = start;
audioOutputSelect.onchange = changeAudioDestination;
videoSelect.onchange = start;

start();




function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

var current_view = '';
var current_cb = '';

$('.viewModeOption').click(function(){
  var option = $(this).attr('id');
  console.log(option);

  if(option === 'vrCheck'){
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
  }else if(option === 'fsMode'){
    launchIntoFullscreen(document.documentElement); // the whole page
  }

});

$('#fullScreen').click(function(e){
  e.preventDefault();
  launchIntoFullscreen(document.documentElement);
});

$('document').ready(function(){
setTimeout(function(){
  if(rearCameraVal !== null){
    setTimeout(function(){
      $('select#videoSource').val(rearCameraVal).change();
    },1000);
  }else{
    console.log('This experience works best on mobile');
  }
},1000);

});
// var currentCB = 'normal';
//
// $('.cbChoice').click(function(){
//   $(this).addClass('selected');
//   var choice = $(this).find('input');
//   var temp_currentCB = choice.val();
//   choice.prop('checked', !choice.prop('checked'));
//
//   if(temp_currentCB != currentCB){
//     $('#left_eye').removeClass(currentCB);
//     $('#right_eye').removeClass(currentCB);
//     $('#left_eye').addClass(temp_currentCB);
//     $('#right_eye').addClass(temp_currentCB);
//     currentCB = temp_currentCB;
//   }
//   $('input[name=cb]').each(function(){
//       var state = $(this).prop('checked');
//       if(state){
//
//       }else{
//         $(this).parent().removeClass('selected');
//       }
//   });
// });

$('#blind').change(function(){
  var val = $(this).val();

  if(val === 0){
    $('.left').removeClass('blur');
    $('.right').removeClass('blur');
  }else{
    $('.left').addClass('blur');
    $('.right').addClass('blur');
    var devVal = val / 10;

    $('#blur feGaussianBlur').attr("stdDeviation", devVal);
  }
});

// Find the right method, call on correct element
function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}
