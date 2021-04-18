//inspired by https://www.creativebloq.com/how-to/data-visualisation-with-p5js

var bgColor, radialArcs = [], fft, mic, soundMic, soundSpectrum;

function setup(){
  let canvas = createCanvas(windowWidth,windowHeight);
  canvas.parent('#colorTab');
  canvas.mousePressed(userStartAudio);

  colorMode(HSB,360,100,100);
  bgColor = color(0,0,95);
  background(bgColor);

  initRadialArcs();
  mic = new p5.AudioIn();
  fft = new p5.FFT(0.4,1024);
  mic.start();
  fft.setInput(mic);
}

function draw(){
  background(bgColor);
  noStroke();
  soundSpectrum = fft.analyze();
  updateRadialArcs();
  drawRadialArcs();
}

// ----------------------------------  Sounds ----------------------------------------
function getNewSoundDataValue(freqType){
  return map(fft.getEnergy(freqType),0,255,0,1);
}

// ----------------------------------  Arcs ----------------------------------------
function initRadialArcs(){
  radialArcs[0] = new RadialArcs(20, height/4, width, 0, 6, 290, 360); // bass
  radialArcs[9] = new RadialArcs(20, height/4, width, PI/3, 6, 290, 360); // bass
  radialArcs[1] = new RadialArcs(30, height/5, width, -PI/5, 4.5, 0, 60);//lowMid
  radialArcs[2] = new RadialArcs(30, height/6, width, PI/4, 4.5, 0, 60);//lowMid
  radialArcs[3] = new RadialArcs(40, height/7, width, -PI/3, 4, 60, 130);//mid
  radialArcs[4] = new RadialArcs(40, height/8, width, PI/8, 4, 60, 130);//mid
  radialArcs[5] = new RadialArcs(50, height/9, width, -PI/2, 3.5, 130, 200);//midHigh
  radialArcs[6] = new RadialArcs(50, height/10, width, PI/10, 3.5, 130, 200);//midHigh
  radialArcs[7] = new RadialArcs(60, height/11, width, -PI/4, 3, 200, 290);//treble
  radialArcs[8] = new RadialArcs(60, height/12, width, PI/5, 3, 200, 290);//treble
  //radialArcs[9] = new RadialArcs(10, height, width, 0, 1, 60, 60); // treb
}

function updateRadialArcs(){
  radialArcs[0].updateArcs(getNewSoundDataValue("bass"));
  radialArcs[9].updateArcs(getNewSoundDataValue("bass"));
  radialArcs[1].updateArcs(getNewSoundDataValue("lowMid"));
  radialArcs[2].updateArcs(getNewSoundDataValue("lowMid"));
  radialArcs[3].updateArcs(getNewSoundDataValue("mid"));
  radialArcs[4].updateArcs(getNewSoundDataValue("mid"));
  radialArcs[5].updateArcs(getNewSoundDataValue("highMid"));
  radialArcs[6].updateArcs(getNewSoundDataValue("highMid"));
  radialArcs[7].updateArcs(getNewSoundDataValue("treble"));
  radialArcs[8].updateArcs(getNewSoundDataValue("treble"));
  //radialArcs[5].updateArcs(0);
}

function drawRadialArcs(){
  radialArcs[2].drawArcs();
  radialArcs[4].drawArcs();
  radialArcs[6].drawArcs();
  radialArcs[3].drawArcs();
  radialArcs[7].drawArcs();
  radialArcs[1].drawArcs();
  radialArcs[5].drawArcs();
  radialArcs[8].drawArcs();
  radialArcs[0].drawArcs();
  radialArcs[9].drawArcs();
}

class RadialArcs{
  constructor(arcCount, minR, maxR, baseR, maxStr, minH, maxH) {
    this.radialArcCount = arcCount;
    this.minRadius = minR;
    this.maxRadius = maxR;
    this.radialArcs = [];
    this.baselineR = baseR;
    this.maxStroke = maxStr;
    this.minHue = minH;
    this.maxHue = maxH;
    this.initArcs();
  }

  initArcs(){
    for(let a=0; a<this.radialArcCount; a++) {
      this.radialArcs[a] = new RadialArc(a, this.radialArcCount, this.minRadius, this.maxRadius, this.baselineR, this.maxStroke, this.minHue, this.maxHue);
    }
  }

  updateArcs(d){
    for(let a=this.radialArcs.length-1; a >= 0; a--) {
      if(a>0) {
        this.radialArcs[a].setValue(this.radialArcs[a-1].getValue());
      } else {
        this.radialArcs[a].setValue(d);
      }
    }
  }

  drawArcs(){
    for(let a=0; a<this.radialArcs.length; a++) {
      this.radialArcs[a].redrawFromData();
    }
  }
}

class RadialArc{
  constructor(id, arcs, minR, maxR, baseR, maxStr, minH, maxH) {
    this.arcID = id;
    this.totalArcs = arcs;
    this.minRadius = minR;
    this.maxRadius = maxR;
    this.arcRadius = this.minRadius + (((this.maxRadius-this.minRadius)/this.totalArcs)*this.arcID+1);
    this.maxStroke = maxStr;
    this.minHue = minH;
    this.maxHue = maxH;
    this.dataVal = 0;
    this.centerX = width/2;
    this.centerY = height/2;
    this.arcMaxRadian = QUARTER_PI;
    this.arcBaseline = baseR;
    this.arcStartRadian = 0;
    this.arcEndRadian = 0;
  }

  setValue(d){
    this.dataVal = d;
  }

  getValue() {
    return this.dataVal;
  }

  redrawFromData(){
    this.updateArc();
    this.drawArc();
  }

  updateArc(){
    this.arcEndRadian = this.arcBaseline + (this.arcMaxRadian * this.dataVal);
    this.arcStartRadian = this.arcBaseline - (this.arcMaxRadian * this.dataVal);
  }

  drawArc() {
    this.dataColor = this.getDataHSBColor(this.dataVal);
    stroke(this.dataColor);
    strokeWeight(map(this.dataVal,0,1,0,this.maxStroke));
    noFill();
    arc(this.centerX,this.centerY,this.arcRadius,this.arcRadius,this.arcStartRadian,this.arcEndRadian);
    arc(this.centerX,this.centerY,this.arcRadius,this.arcRadius,this.arcStartRadian-PI,this.arcEndRadian-PI);
  }

  getDataHSBColor(d){
    this.dataHue = map(d,0,1,this.minHue,this.maxHue);
    this.dataSaturation = map(d,0,1,0,100);
    this.dataBrightness = map(d,0,1,90,100);
    return color(this.dataHue,this.dataSaturation,this.dataBrightness);
  }
}
