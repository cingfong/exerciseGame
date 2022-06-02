// 1:36:45
import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'


const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 575;
const gravity = 1.5;

class Player {
  constructor() {
    this.speed = 10
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
  }
}
class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}
class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

// ---
let platformImage = createImage(platform)

let image = new Image()
image.src = platform

let player = new Player();
let platforms = [];
let genericObjects = [];

let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};
let scrollOffset = 0;
// ---
function init() {
  platformImage = createImage(platform)

  image = new Image()
  image.src = platform

  player = new Player();
  platforms = [
    new Platform({ x: (platformImage.width * 4 + 300 - 2), y: 250, image: createImage(platformSmallTall) }),
    new Platform({ x: -1, y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width - 3), y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width * 2 + 100), y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width * 3 + 300), y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width * 4 + 300 - 2), y: 450, image: platformImage }),
  ];
  genericObjects = [
    new GenericObject({ x: -1, y: -1, image: createImage(background) }),
    new GenericObject({ x: -1, y: -1, image: createImage(hills) })
  ];
  scrollOffset = 0;
}

function animate() {
  //  canvas 刷新功能
  requestAnimationFrame(animate);
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height);
  genericObjects.forEach((platform) => {
    platform.draw()
  })
  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();
  // console.log('go')
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((platform) => {
        platform.position.x -= player.speed * .66
      })
    } else if (keys.left.pressed) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((platform) => {
        platform.position.x += player.speed * .66
      })
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
  // wind
  if (scrollOffset > 2000) console.log("your win");
  //loss
  if (player.position.y > canvas.height) {
    init()
  }
}

init()
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
      player.velocity.y -= 10;
      break;
  }
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
