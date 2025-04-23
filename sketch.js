let isFlipped = false; // 判斷是否翻轉
let angle = 0; // 翻轉角度
let flipping = false; // 是否正在翻轉
let img1, img2; // 用於存儲圖片
let flowers = []; // 存儲小花的位置和大小

function preload() {
  // 載入圖片
  img1 = loadImage('IMG_0748.jpg'); // 替換為第一張圖片的路徑
  img2 = loadImage('IMG_0525.JPG'); // 替換為第二張圖片的路徑
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // 啟用 WEBGL 渲染模式
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  // 隨機生成小花的位置和大小，避免重疊文字區域，並限制在明信片範圍內
  while (flowers.length < 20) { // 限制小花數量為 20
    let x = random(-280, 280); // 明信片的寬度範圍，留出邊界
    let y = random(-180, 180); // 明信片的高度範圍，留出邊界
    let size = random(15, 25);

    // 檢查是否與文字區域重疊（文字區域範圍擴大以適應字體大小 45）
    if (x > -200 && x < 200 && y > -90 && y < 90) continue;

    // 檢查是否與其他小花重疊
    let overlapping = false;
    for (let flower of flowers) {
      let d = dist(x, y, flower.x, flower.y);
      if (d < size + flower.size) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      flowers.push({ x, y, size });
    }
  }
}

function draw() {
  background(220); // 設置背景為淺灰色，避免與明信片顏色混淆

  if (flipping) {
    if (isFlipped) {
      angle -= 10; // 翻回正面
      if (angle <= 0) {
        angle = 0;
        flipping = false; // 停止翻轉
      }
    } else {
      angle += 10; // 翻到背面
      if (angle >= 180) {
        angle = 180;
        flipping = false; // 停止翻轉
      }
    }
  }

  rotateY(radians(angle)); // 根據角度進行 3D 翻轉效果

  if (angle > 90) {
    // 背面
    push();
    rotateY(PI); // 翻轉 180 度以顯示背面內容
    fill('#31572c'); // 背面顏色為深綠色
    stroke(150); // 添加灰色邊框
    strokeWeight(4);
    rect(0, 0, 600, 400, 20); // 圓角矩形，圓角半徑為 20

    // 背面內容
    let backText = createGraphics(600, 400);
    backText.textFont("標楷體");
    backText.textAlign(LEFT, TOP);
    backText.textSize(24);
    backText.fill('#ecf39e');
    backText.background(255, 255, 255, 0);
    backText.text(
      "姓名: 柳承穎\n身高: 173\n體重: 秘密\n年齡: 18\n興趣: 彈吉他\nMBTI: ENFJ\n其他: 家裡養了一隻貓叫柳丁",
      50,
      50
    );
    texture(backText);
    rect(0, 0, 600, 400, 20);

    // 繪製圖片
    push();
    texture(img1);
    rect(180, -115, 200, 150, 20);
    pop();

    push();
    texture(img2);
    rect(180, 80, 150, 220, 20);
    pop();

    // 繪製粉色蝴蝶
    drawButterflies();

    pop();
  } else {
    // 正面
    fill('#31572c'); // 正面顏色為深綠色
    stroke(150);
    strokeWeight(4);
    rect(0, 0, 600, 400, 20);

    // 正面文字
    let frontText = createGraphics(600, 400);
    frontText.textFont("標楷體");
    frontText.textAlign(CENTER, CENTER);
    frontText.textSize(45); // 將字體大小改為 45
    frontText.fill('#ecf39e');
    frontText.background(255, 255, 255, 0);
    frontText.text("淡江大學\n教育科技學系", 300, 200);
    texture(frontText);
    rect(0, 0, 600, 400, 20);

    // 繪製雛菊小花
    for (let flower of flowers) {
      push();
      translate(flower.x, flower.y);

      // 繪製花瓣
      fill(255); // 白色花瓣
      noStroke();
      for (let i = 0; i < 10; i++) {
        rotate(TWO_PI / 10); // 每次旋轉 36 度
        ellipse(0, flower.size / 2, flower.size / 3, flower.size); // 花瓣
      }

      // 繪製花心
      fill(255, 204, 0); // 黃色花心
      ellipse(0, 0, flower.size / 2, flower.size / 2); // 花心
      pop();
    }
  }
}

function drawButterflies() {
  // 定義蝴蝶的位置和大小，限制在明信片下方範圍內
  let butterflies = [
    { x: -200, y: 100, size: 30 },
    { x: -100, y: 120, size: 40 },
    { x: 0, y: 140, size: 35 },
    { x: 100, y: 120, size: 25 },
    { x: 200, y: 100, size: 30 },
  ];

  for (let butterfly of butterflies) {
    // 確保蝴蝶不超出明信片邊框，且不蓋到圖片
    if (
      butterfly.x < -280 || butterfly.x > 280 || // 超出明信片左右邊界
      butterfly.y < -180 || butterfly.y > 180 || // 超出明信片上下邊界
      (butterfly.x > 80 && butterfly.x < 280 && butterfly.y > -200 && butterfly.y < 200) // 圖片區域
    ) {
      continue;
    }

    push();
    translate(butterfly.x, butterfly.y);

    // 繪製蝴蝶翅膀
    fill(255, 182, 193, 200); // 更淺的粉色，帶透明度
    noStroke();
    ellipse(-butterfly.size * 0.6, 0, butterfly.size * 1.2, butterfly.size * 0.8); // 左翅膀
    ellipse(butterfly.size * 0.6, 0, butterfly.size * 1.2, butterfly.size * 0.8); // 右翅膀

    // 繪製蝴蝶身體
    fill(139, 69, 19); // 深棕色
    rect(0, 0, butterfly.size * 0.2, butterfly.size * 0.8, 5); // 身體

    // 繪製蝴蝶頭部
    fill(139, 69, 19); // 深棕色
    ellipse(0, -butterfly.size * 0.5, butterfly.size * 0.3, butterfly.size * 0.3); // 頭部

    // 繪製蝴蝶觸角
    stroke(139, 69, 19); // 深棕色
    strokeWeight(2);
    line(0, -butterfly.size * 0.5, -butterfly.size * 0.3, -butterfly.size * 0.8); // 左觸角
    line(0, -butterfly.size * 0.5, butterfly.size * 0.3, -butterfly.size * 0.8); // 右觸角

    pop();
  }
}

function drawPawPrints() {
  // 定義貓掌印的位置和大小，限制在明信片左下角範圍內
  let pawPrints = [
    { x: -250, y: 120, size: 30 },
    { x: -200, y: 150, size: 40 },
    { x: -220, y: 180, size: 25 },
  ];

  for (let paw of pawPrints) {
    push();
    translate(paw.x, paw.y);

    // 繪製掌心
    fill(255, 182, 193); // 粉紅色
    noStroke();
    ellipse(0, 0, paw.size, paw.size); // 掌心

    // 繪製腳趾
    let toeSize = paw.size * 0.35; // 腳趾大小相對於掌心
    ellipse(-toeSize, -toeSize * 1.5, toeSize, toeSize); // 左上腳趾
    ellipse(toeSize, -toeSize * 1.5, toeSize, toeSize); // 右上腳趾
    ellipse(-toeSize * 1.2, -toeSize * 0.5, toeSize, toeSize); // 左下腳趾
    ellipse(toeSize * 1.2, -toeSize * 0.5, toeSize, toeSize); // 右下腳趾

    pop();
  }
}

function mousePressed() {
  // 當鼠標點擊時觸發翻轉
  if (!flipping) {
    flipping = true;
    isFlipped = !isFlipped; // 切換翻轉狀態
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時調整畫布大小
}
