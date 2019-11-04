var db;
var drawData = [];
var sodaData = [];
var fudeData = [];

var DATA_LIMIT = 50;

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

  // 線描画データ取得
  // データ形式を再考したい
  var drawRef = db.ref("drawings");
  drawRef.on("child_added", function(d) {
    if (drawData.length > DATA_LIMIT) {
      drawData.shift();
    }
    d = d.val();
    if (d.len > 0) {
      d.fIndex = 0;
      d.bIndex = 0;
      d.startX = width / 2; //random(50, width-50);
      d.startY = height / 2; //random(50, height-50);
      drawData.push(d);
    }
  });

  // ソータデータ取得，初期設定
  var sodaRef = db.ref("soda");
  sodaRef.on("child_added", function(d) {
    if (sodaData.length > DATA_LIMIT) {
      sodaData.shift();
    }
    d = d.val();
    if (d.bubbles.length > 0) {
      d.size = d.size;
      d.startX = random(10, width - 10);
      d.startY = random(10, height - 10);
      d.bubbles.forEach(function(v, i, a) {
        v.delay = i * 4;
        v.movSize = 0;
        v.life = random(500, 800);

        //if(i == 0) {
        //  v.x = random(10, width-10);
        //  v.y = random(10, height-10);
        //}
        //else {
        //  var pv = a[i-1];
        //  var r = v.size+pv.size;
        //  if(a[0].x < width/2) {
        //    //左から右へ
        //    v.x = pv.x + random(r/4, r);
        //    v.y = pv.y + random(-50, 50);// todo
        //  }
        //  else {
        //    //右から左へ
        //    v.x = a[i-1].x + random(-r/4, -r);
        //    v.y = a[i-1].y + random(-50, 50);// todo
        //  }
        //}

        v.x = d.startX;
        v.y = d.startY;
        v.angle = random(TWO_PI);
        v.vel = random(a.length / 4.0, a.length);
      });

      sodaData.push(d);
    }
  });

  // 筆データ
  var fudeRef = db.ref("fude");
  fudeRef.on("child_added", d => {
    if (fudeData.length > DATA_LIMIT) {
      fudeData.shift();
    }
    d = d.val();

    if (d.len > 0) {
      d.fIndex = 0;
      d.bIndex = 0;
      d.startX = width / 2; //random(50, width-50);
      d.startY = height / 2; //random(50, height-50);
      fudeData.push(d);
    }
  });

  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  drawDrawing();
  drawSoda();
  drawFude();
}

// 線が泳ぐアニメーションを描くよ
function drawDrawing() {
  //todo 完全にフレームアウトしたら処理したくない

  for (var i = 0; i < drawData.length; i++) {
    var cd = drawData[i];
    beginShape();
    noFill();
    stroke(0);
    // strokeWeight対応
    if (cd.weight) {
      strokeWeight(cd.weight);
    } else {
      strokeWeight(3);
    }
    // color対応
    if (cd.col) {
      stroke(cd.col.r, cd.col.g, cd.col.b);
    }
    for (var j = cd.bIndex; j < cd.fIndex; j++) {
      vertex(cd.startX + cd.x[j] / 2, cd.startY + cd.y[j] / 2);
    }
    endShape();

    if (cd.fIndex < cd.len) {
      cd.fIndex++;
    } else if (cd.fIndex > cd.len - 1 && cd.bIndex < cd.len) {
      cd.bIndex++;
    } else {
      cd.startX += cd.x[cd.len - 1] / 2;
      cd.startY += cd.y[cd.len - 1] / 2;
      cd.fIndex = 0;
      cd.bIndex = 0;
    }
  }
}

// タンサンボムを描くよ
function drawSoda() {
  for (var i = 0; i < sodaData.length; i++) {
    var s = sodaData[i];

    for (var j = 0; j < s.bubbles.length; j++) {
      var b = s.bubbles[j];
      if (b.delay > 0) {
        b.delay--;
      } else {
        b.movSize += (b.size - b.movSize) / 3.0;
        b.vel = b.vel / 1.1;
        b.x += cos(b.angle) * b.vel;
        b.y += sin(b.angle) * b.vel;
      }

      if (b.life > 0) {
        b.life -= 0.5;
        fill(s.col.r, s.col.g, s.col.b, b.life);
        noStroke();
        ellipse(b.x, b.y, b.movSize * 2, b.movSize * 2);
      }
    }
  }
}

// 筆が泳ぐアニメーションを描くよ
// 動きはdrawDrawingと同じだよ
function drawFude() {
  //todo 完全にフレームアウトしたら処理したくない
  for (var i = 0; i < fudeData.length; i++) {
    var cd = fudeData[i];
    noFill();
    stroke(0);
    // color対応
    if (cd.col) {
      stroke(cd.col.r, cd.col.g, cd.col.b);
    }
    // for (var j = cd.bIndex; j < cd.fIndex; j++) {
    //   var nextJ = j + 1;
    //   if (nextJ >= cd.len) nextJ = 0;
    //   // fude特有のデータ
    //   strokeWeight(cd.weight[j]);
    //   line(
    //     cd.startX + cd.x[j] / 2,
    //     cd.startY + cd.y[j] / 2,
    //     cd.startX + cd.x[nextJ] / 2,
    //     cd.startY + cd.y[nextJ] / 2
    //   );
    // }
    // 一旦
    beginShape();
    if (cd.fIndex < cd.len) strokeWeight(cd.weight[cd.fIndex]);
    else strokeWeight(cd.weight[cd.bIndex]);

    for (var j = cd.bIndex; j < cd.fIndex; j++) {
      vertex(cd.startX + cd.x[j] / 2, cd.startY + cd.y[j] / 2);
    }
    endShape();

    if (cd.fIndex < cd.len) {
      cd.fIndex++;
    } else if (cd.fIndex > cd.len - 1 && cd.bIndex < cd.len) {
      cd.bIndex++;
    } else {
      cd.startX += cd.x[cd.len - 1] / 2;
      cd.startY += cd.y[cd.len - 1] / 2;
      cd.fIndex = 0;
      cd.bIndex = 0;
    }
  }
}
