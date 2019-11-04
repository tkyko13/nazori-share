var db;
var mx,my;
var value=0;

var sodaCol;
var bubbles = [];

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
  
  colorMode(HSB);
  sodaCol = color(random(360), 88, 100);
}

function draw() {
  background(sodaCol);
  
  // 泡の発生
  var r = 80 - (log(value)*10);
  if(random(r) < 1) {
    var bObj = {};
    bObj.x = random(width);
    bObj.y = height;
    bObj.size = 10+value/10.0 + random(-value/25.0, value/25.0);
    
    bubbles.push(bObj);
  }
  
  for(var i=0; i<bubbles.length; i++) {
    var b = bubbles[i];
    
    // move
    b.x += random(-5, 5);
    b.y -= 5;
    
    // delete
    if(b.y < -100) {
      bubbles.shift();
      i--;
    }
    
    // draw
    noStroke();
    fill(255);
    ellipse(b.x, b.y, b.size, b.size);
  }
  
  // text
  fill(0, 60);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(50);
  if(value < 100) {
    text("スマートフォンを降ってみよう！", 0, height/2-40, width, 80);
  }
  else {
    text("泡が溜まったらスワイプ！！", 0, height/2-40, width, 80);
  }
}

function deviceShaken() {
  value++;
}

//debug
function touchMoved() {
  //print(value);
  value+=2;
}

function mousePressed() {
  mx=mouseX;
  my=mouseY;
}

function mouseReleased() {
  var d = dist(mx, my, mouseX, mouseY);
  if(d > 100) {
    sendData();
    bubbles = [];
    value = 0;
  }
}

function sendData() {
  if(bubbles.length <= 1) {
    //alert("短すぎるため送信できませんでした．");
    return false;
  }
  
  var ref = db.ref('soda');
  
  var sendData = {};
  sendData.bubbles = [];
  sendData.col = {r:int(red(sodaCol)), g:int(green(sodaCol)), b:int(blue(sodaCol))};
  //sendData.len = bubbles.length;
  
  for(var i=0; i<bubbles.length; i++) {
    sendData.bubbles.push({size:int(bubbles[i].size)});
  }
  
  ref.push(sendData);
  return true;
}
