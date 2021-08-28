import Triangle from './triangle'

let p5
const triangles = []
const options = {
  fps: 50,
  life: 21
}

export function main (_p5) {
  p5 = _p5
  p5.setup = (_) => {
    p5.frameRate(options.fps)
    const canvas = p5.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent('canvas')
    setTimeout(CreateTriangle, 1500)
    setInterval(function () {
      if (triangles.length < 6) { CreateTriangle() }
    }, 5000)

    function CreateTriangle () {
      const star = new Triangle(p5, options)
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
