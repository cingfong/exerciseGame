// 2:09:00
import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'


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
    this.width = 66;
    this.height = 150;
    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    }
    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 177
  }
  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.frames++
    if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0
    else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0
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

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)

let image = new Image()
image.src = platform

let player = new Player();
let platforms = [];
let genericObjects = [];
let lastKey

let keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false
  }
};
let scrollOffset = 0;

function init() {
  platformImage = createImage(platform)

  image = new Image()
  image.src = platform

  player = new Player();
  platforms = [
    new Platform({ x: (platformImage.width * 4 + 300 - 2 + platformImage.width - platformSmallTallImage.width), y: 250, image: createImage(platformSmallTall) }),
    new Platform({ x: -1, y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width - 3), y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width * 2 + 100), y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width * 3 + 300), y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width * 4 + 300 - 2), y: 450, image: platformImage }),
    new Platform({ x: (platformImage.width * 5 + 700 - 2), y: 450, image: platformImage }),
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
  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
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
    } else if (keys.left.pressed && scrollOffset > 0) {
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
  if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
    player.frames = 1
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
  } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
  }
  // wind
  if (scrollOffset > (platformImage.width * 5 + 300 - 2 + platformImage.width)) {
    alert("your win");
    keys.right.pressed = false;
    init()
  }
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
      lastKey = 'left'
      break;
    case 83:
      break;
    case 68:
      keys.right.pressed = true;
      lastKey = 'right'
      break;
    case 87:
      if (!keys.up.pressed && player.velocity.y === 0) {
        keys.up.pressed = true
        player.velocity.y -= 25;
      }
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
      keys.up.pressed = false
      break;
  }
});
