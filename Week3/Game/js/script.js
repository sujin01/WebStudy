function page_move_start() {
    window.location.href = "second.html";
}

function page_move_back() {
  window.location.href = "index.html";
}

var balls = [
  { color: "red", size: 30, x: 0, y: 10, dx: 0, dy: 0 },
  { color: "orange", size: 40, x: 0, y: 10, dx: 0, dy: 0 },
  { color: "yellow", size: 50, x: 0, y: 10, dx: 0, dy: 0 },
  { color: "green", size: 60, x: 0, y: 10, dx: 0, dy: 0 },
  { color: "blue", size: 70, x: 0, y: 10, dx: 0, dy: 0 },
  { color: "indigo", size: 80, x: 0, y: 10, dx: 0, dy: 0 },
  { color: "purple", size: 90, x: 0, y: 10, dx: 0, dy: 0 },
  { color: "white", size: 100, x: 0, y: 10, dx: 0, dy: 0 },

  
];

window.onload = function() {
  const container = document.getElementById("container");
  let currentBall = [];

  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const initialX = containerWidth / 2;
  const initialY = 10;

  let i = 0;
  let j = 0;
  currentBall.push(getRandomBall());

  // 클릭 시 공들을 아래로 이동하고 충돌 검사
  container.onclick = function(event) {
    //onclick.disabled = true;
    var clickX = event.clientX;
    j = i;
    i++;
    currentBall.push(getRandomBall());
    currentBall[j].dy = 0.5;
    currentBall[j].x = clickX - container.offsetLeft;
  
    setInterval(function() {
        updateBalls();
        //checkCollisions();
    }, 30);
  };

  function getBall(num){
    let newBall = document.createElement("div");
    newBall.className = "ball";
    newBall.y = 10;
    newBall.size = balls[num].size;
    newBall.style.backgroundColor = balls[num].color;
    newBall.style.width = balls[num].size + "px";
    newBall.style.height = balls[num].size + "px";
    newBall.style.left = (initialX - balls[num].size / 2 ) + "px";
    newBall.style.top = initialY + "px";
    container.appendChild(newBall);

    return newBall;
  };
  function getRandomBall(){
    let type = Math.floor(Math.random() * 7);
    return getBall(type)
  };
  function updateBalls() {
    currentBall[j].y += currentBall[j].dy;
    if (currentBall[j].y + currentBall[j].size >= containerHeight) {
      // 바닥에 도달하면 정지
      currentBall[j].y = containerHeight - currentBall[i].size;
      currentBall[j].dy = 0;
      onclick.disabled = false;
    } else {
      currentBall[j].dy = 5; // 계속 아래로 이동
    }
    currentBall[j].style.left = currentBall[j].x + "px";
    currentBall[j].style.top = currentBall[j].y + "px";
  }
  
  function checkCollisions() {
    for (var i = index + 1; i < balls.length; i++) {
        var otherBall = balls[i];
        if (collided(currentBall, otherBall)) {
            // 같은 색이 아니라면 색을 교환
            if (currentBall.color == otherBall.color) {
                var tempColor = currentBall.color;
                currentBall.color = otherBall.color;
                otherBall.color = tempColor;
                currentBall.element.style.backgroundColor = currentBall.color;
                otherBall.element.style.backgroundColor = otherBall.color;
            }
        }
    }
  }
  
  function collided(ball1, ball2) {
    var dx = ball1.x - ball2.x;
    var dy = ball1.y - ball2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var radiusSum = ball1.size / 2 + ball2.size / 2;
    return distance < radiusSum;
  }
  

};





