var db;
var mx = [];
var my = [];
var weight = [];

var isDraw = false;

var col;

function setup() {
  let config = {
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

  // 色設定
  colorMode(HSB);
  // ランダム
  col = color(random(360), 88, 100);
}

function draw() {
  background(255);

  if (isDraw == true) {
    mx.push(mouseX);
    my.push(mouseY);
    weight.push(getCurrentWeight());
  } else {
    fill(col, 60);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(50);
    text("指でなぞってみよう！", 0, height / 2 - 40, width, 80);
  }

  noFill();
  stroke(col);
  strokeWeight(getCurrentWeight()); //一旦
  beginShape();
  for (var i = 0; i < mx.length; i++) {
    vertex(mx[i], my[i]);
  }
  endShape();
  // for (let i = 1; i < mx.length; i++) {
  //   let sw = weight[i]; //dist2weight(mx[i - 1], my[i - 1], mx[i], my[i]);
  //   strokeWeight(sw);
  //   line(mx[i - 1], my[i - 1], mx[i], my[i]);
  // }
}

function mousePressed() {
  isDraw = true;
}

function mouseReleased() {
  isDraw = false;
  isWeighClick = false;

  sendData();

  mx = [];
  my = [];
  weight = [];
}

function sendData() {
  if (mx.length > 60 * 10) {
    alert("長過ぎるため送信できませんでした．10秒以内でお願いします．");
    return false;
  } else if (mx.length <= 1) {
    //alert("短すぎるため送信できませんでした．");
    return false;
  }

  let ref = db.ref("fude");

  let sendData = {};
  sendData.x = [];
  sendData.y = [];
  sendData.col = { r: int(red(col)), g: int(green(col)), b: int(blue(col)) };
  sendData.weight = weight;
  sendData.len = mx.length;

  // 同じ数字が多すぎるので1/2サイズにしてもいいかも
  for (let i = 0; i < mx.length; i++) {
    sendData.x.push(mx[i] - mx[0]);
    sendData.y.push(my[i] - my[0]);
  }
  for (let i = 0; i < mx.length - 1; i++) {
    // sendData.weight.push(int(dist2weight(mx[i], my[i], mx[i + 1], my[i + 1])));
  }
  // 太さを同じ長さにするため，疲れわないはずだけどエラー回避
  // sendData.weight.push(1);

  ref.push(sendData);
  return true;
}

function getCurrentWeight() {
  let len = mx.length;
  if (len < 2) {
    return 3;
  }

  let x1 = mx[len - 2];
  let y1 = my[len - 2];
  let x2 = mx[len - 1];
  let y2 = my[len - 1];
  let cw = dist(x1, y1, x2, y2) / 5.0;
  let pw = weight[weight.length - 1];

  return pw + (cw - pw) / 2.0;
}
