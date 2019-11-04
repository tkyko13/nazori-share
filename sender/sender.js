var db;
var mx = [];
var my = [];
var r=0,g=0,b=0;
var weight = 1;

var isWeighClick = false;
var weightClickX,weightClickY;
var isDraw = false;

var cols = [
{r:255, g:0, b:0},
{r:0, g:255, b:0},
{r:0, g:0, b:255},
{r:255, g:255, b:0},
{r:0, g:255, b:255},
{r:255, g:0, b:255},
{r:0, g:0, b:0}
];

function setup() {
  var config = {
    apiKey: "AIzaSyBUHrlSJifCUVhAE7I6NbLOhavPIqp4w0o",
    authDomain: "nazori-share.firebaseapp.com",
    databaseURL: "https://nazori-share.firebaseio.com",
    projectId: "nazori-share",
    storageBucket: "nazori-share.appspot.com",
    messagingSenderId: "329569109700"
  };
  firebase.initializeApp(config);
  db = firebase.database();
  
  //画面いっぱいに
  createCanvas(windowWidth, windowHeight);
  
}

function draw() {
  background(255);
  
  // draw area
  fill(240);
  noStroke();
  rect(0, 100, width, height-100);
  
  if(isDraw == true) {
    mx.push(mouseX);
    my.push(mouseY);
  }
  else {
    fill(0, 60);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(50);
    text("指でなぞってみよう！", 0, height/2-40, width, 80);
  }
  
  noFill();
  stroke(r, g, b);
  strokeWeight(weight);
  beginShape();
  for(var i=0; i<mx.length; i++) {
    vertex(mx[i], my[i]);
  }
  endShape();
  
  // color picker
  for(var i=0; i<cols.length; i++) {
    noStroke();
    fill(cols[i].r, cols[i].g, cols[i].b);
    rect(i*100, 0, 100, 100);
  }
  
  // weight picker
  fill(r, g, b);
  ellipse(850, 50, weight, weight);
  
  if(isWeighClick == true) {
    //weight = dist(weightClickX, weightClickY, mouseX, mouseY);
    weight += (mouseX - pmouseX)/4;
    weight = int(abs(weight));
  }
}

function mousePressed() {
  if(mouseY > 100) {
    isDraw = true;
  }
  else {
    var colInd = int(mouseX / 100);
    if(colInd < cols.length) {
      r = cols[colInd].r;
      g = cols[colInd].g;
      b = cols[colInd].b;
    }
    else {
      weightClickX = mouseX;
      weightClickY = mouseY;
      pmouseX = mouseX;
      isWeighClick = true;
    }
  }
  //r = int(random(255));
  //g = int(random(255));
  //b = int(random(255));
}

function mouseReleased() {
  isDraw = false;
  isWeighClick = false;
  
  sendData();
  
  mx = [];
  my = [];
}

function sendData() {
  if(mx.length > 60*10) {
    alert("長過ぎるため送信できませんでした．10秒以内でお願いします．");
    return false;
  }
  else if(mx.length <= 1) {
    //alert("短すぎるため送信できませんでした．");
    return false;
  }
  
  var ref = db.ref('drawings');
  
  var sendData = {};
  sendData.x = [];
  sendData.y = [];
  sendData.col = {r:r, g:g, b:b};
  sendData.weight = weight;
  sendData.len = mx.length;
  
  // 同じ数字が多すぎるので1/2サイズにしてもいいかも
  for(var i=0; i<mx.length; i++) {
    sendData.x.push(mx[i]-mx[0]);
    sendData.y.push(my[i]-my[0]);
  }
  
  ref.push(sendData);
  return true;
}
