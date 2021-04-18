//inpiried by https://js6450.github.io/audio-viz/index.html

let mic, fft, bgColor;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight/1.5);
  canvas.parent('#FFTTab');
  canvas.mousePressed(userStartAudio);
  colorMode(HSB,360,100,100);
  bgColor = color(0,0,95);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  noStroke();
}

function draw() {
  background(bgColor);

  let spectrum = fft.analyze();

  fill(255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    let h = map(i, 0, spectrum.length, 0, 300);
    let alpha = map(spectrum[i], 0, 255, 0, 15);
    fill(h, 100, 100, alpha);
    ellipse(x, y, 5, 5);
  }
}
