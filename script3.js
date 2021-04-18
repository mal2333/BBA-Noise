var mic, button, volhistory = [];

function setup() {
  let canvas = createCanvas(windowWidth, 200);
  canvas.parent('#waveTab');
  canvas.mousePressed(userStartAudio);
  colorMode(HSB,360,100,100);
  bgColor = color(0,0,95);
  mic = new p5.AudioIn();
  mic.start();
}

function draw() {
  background(bgColor);
  var vol = mic.getLevel();
  volhistory.push(vol);
  strokeWeight(1);
  stroke(color(0,0,0));
  noFill();
  push();
  beginShape();
  for (var i = 0; i < volhistory.length; i++) {
    var y = map(volhistory[i], 0, 1, height/2, 0);
    line(i, y, i, height/2);
    line(i, height/2, i, height - y);
  }
  endShape();
  pop();
  if (volhistory.length > width-50) {
    volhistory.splice(0, 1);
  }

  stroke(0);
  line(volhistory.length, 0, volhistory.length, height);
}
