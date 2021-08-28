interface TriangleOptions {
  life: number;
  fps: number;
}

interface TriangleClass {
  mature: boolean;
  side: number;
  life: number;
  y1: number;
  y2: number;
  y3: number;
  x1: number;
  x2: number;
  x3: number;
  age: number;
  health: number;
  rotation: number;
  time: number;
  speed: number;
  timeX: number;
  timeY: number;
  timeRotation: number;
  locX: number;
  locY: number;
  WW: number;
  WH: number;
  alfa: number;
  isAlive:() => void;
  show:() => void;
  update:() => void;
}
const Triangle = function (this: TriangleClass, p5:any, options: TriangleOptions) {
  this.side = p5.random(p5.width / 10, p5.height / 2)
  this.y1 = 0
  this.y2 = 0
  this.y3 = -this.side * 1.7
  this.x1 = -this.side
  this.x2 = this.side
  this.x3 = 0

  this.life = options.life * options.fps
  this.age = 0
  this.mature = false
  this.health = (this.life > 255 ? this.life / 255 : 255 / this.life)
  this.rotation = p5.random(0, 360)
  this.time = 400
  this.speed = 1 / 200

  this.timeX = parseInt(p5.random(1, this.time))
  this.timeY = parseInt(p5.random(1, this.time))
  this.timeRotation = parseInt(p5.random(1, this.time))
  this.locX = p5.random(1, p5.width)
  this.locY = p5.random(1, p5.height)
  this.WW = p5.width
  this.WH = p5.height

  this.update = function () {
    this.y1 += 1 / 100
    this.y2 += 1 / 100
    this.y3 -= 1 / 100
    this.x1 -= 1 / 100
    this.x2 += 1 / 100

    this.age += 1
    if (this.mature === false) {
      this.alfa = this.age * this.health
    } else {
      this.alfa -= this.health * 5
    }
    if (this.age >= this.life / 1.5) {
      this.mature = true
    }

    if (this.timeRotation === this.time / 2) { this.timeRotation = parseInt(p5.random(1, this.time)) }
    if (this.timeY === this.time / 2) { this.timeY = parseInt(p5.random(1, this.time)) }
    if (this.timeX === this.time / 2) { this.timeX = parseInt(p5.random(1, this.time)) }

    if (this.timeX > this.time / 2) {
      if (this.locX > this.side) {
        this.timeX -= 1
        this.locX -= this.speed
      } else {
        this.timeX = parseInt(p5.random(1, this.time / 2))
      }
    } else if (this.locX < this.WH - this.side) {
      this.timeX += 1
      this.locX += this.speed
    } else {
      this.timeX = parseInt(p5.random(this.time / 2, this.time))
    }

    if (this.timeY > this.time / 2) {
      if (this.locY > this.side) {
        this.timeY -= 1
        this.locY -= this.speed
      } else {
        this.timeY = parseInt(p5.random(1, this.time / 2))
      }
    } else if (this.locY < this.WH - this.side) {
      this.timeY += 1
      this.locY += this.speed
    } else {
      this.timeY = parseInt(p5.random(this.time / 2, this.time))
    }
    if (this.timeRotation > this.time / 2) {
      this.timeRotation -= 1
      this.rotation -= this.speed
    } else {
      this.timeRotation += 1
      this.rotation += this.speed
    }
  }
  this.show = function () {
    p5.push()
    p5.noFill()
    p5.stroke(0, 255, 0, this.alfa)
    p5.smooth()

    p5.translate(this.locX, this.locY)
    p5.rotate(this.rotation)
    p5.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3)
    p5.pop()
  }
  this.isAlive = () => this.age <= 1000
}

export default Triangle
