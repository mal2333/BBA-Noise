var wavesurfer = WaveSurfer.create({
  container: '#waveform',
  backgroundColor: 'white',
  waveColor: 'black',
  hideScrollar: true,
  barWidth: 0.2,
  bufferSize: 2048,
  height:300,
  plugins: [
    WaveSurfer.microphone.create()
  ]
});

wavesurfer.microphone.on('deviceReady', function(stream) {
    console.log('Device ready!', stream);
});

wavesurfer.microphone.on('deviceError', function(code) {
    console.warn('Device error: ' + code);
});
