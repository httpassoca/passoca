let p5
const triangles = []
const frmRate = 50
export function main (_p5) {
  p5 = _p5
  p5.setup = (_) => {
    const Triangle = function () {
      this.side = p5.random(p5.width / 10, p5.height / 2)
      this.y1 = 0
      this.y2 = 0
      this.y3 = -this.side * 1.7
      this.x1 = -this.side
      this.x2 = this.side
      this.x3 = 0

      // 21 seconds of life
      this.life = 21 * 30
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
      this.isAlive = function () {
        if (this.age > 1000) { return false } else { return true }
      }
    }

    p5.frameRate(frmRate)
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('canvas')
    setTimeout(CreateTriangle, 1500)
    setInterval(function () {
      if (triangles.length < 6) { CreateTriangle() }
    }, 10000)

    function CreateTriangle () {
      const star = new Triangle()
      triangles.push(star)
    }
  }
  p5.draw = (_) => {
    p5.clear()
    for (let i = triangles.length - 1; i >= 0; i--) {
      if (triangles[i].isAlive()) {
        triangles[i].update()
        triangles[i].show()
      } else {
        triangles.splice(i, 1)
      }
    }
  }
}
