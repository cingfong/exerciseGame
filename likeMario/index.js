// 53:28
const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gravity = 1.5;

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
      // x:
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 30;
    this.height = 30;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    // 加總大於高度則回傳至0
    // 加上 velocity.y 是因為加入則代表下一秒的this.position.y的位置了
    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity;
    else this.velocity.y = 0;
  }
}
class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };
    this.width = 200;
    this.height = 20;
  }
  draw() {
    c.fillStyle = "blue";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
const player = new Player();
const platforms = [
  new Platform({ x: 200, y: 100 }),
  new Platform({ x: 500, y: 200 }),
];

function animate() {
  //  canvas 刷新功能
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.update();
  platforms.forEach((platform) => {
    platform.draw();
  });
  // console.log('go')
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      platforms.forEach((platform) => {
        platform.position.x -= 5;
      });
    } else if (keys.left.pressed) {
      platforms.forEach((platform) => {
        platform.position.x += 5;
      });
    }
  }
  platforms.forEach((platform) => {
    if (
      // 若物體比platform還高則將重力歸0
      player.position.y + player.height <= platform.position.y &&
      // 若物體接近時重力會下降
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      // 物體離開platform的x軸則也會增加重力
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });
}

animate();
// 應加上 window 但是沒加也算是window的新增事件
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = true;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = true;
      break;
    case 87:
      player.velocity.y -= 20;
      break;
  }
  console.log(keys.left.pressed);
});

// 應加上 window 但是沒加也算是window的新增事件
addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      keys.left.pressed = false;
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = false;
      break;
    case 87:
      player.velocity.y -= 20;
      break;
  }
});
