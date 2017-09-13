import device
import ui.ImageView

exports = Class(ui.ImageView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      width: opts.size,
      height: opts.size,
      image: opts.image
    })

    supr(this, 'init', [opts]);

    this.type = opts.type
    this.style.x = opts.x
    this.style.y = opts.y
    this.style.scale = 1

    const floorY = opts.floorY || device.height - 422
    const gravity = opts.gravity ||  0.5
    const radius = opts.radius || 15
    const bounciness = opts.bounciness || 0.75
    const lifeSpeed = opts.lifeSpeed || 0.997 + Math.random() * 0.002

    this.vx = -radius + Math.random() * (radius * 2)
    this.vy = -radius + Math.random() * (radius * 2)

    this.update = () => {
      // add gravity to velocity on y axis
      this.vy += gravity;

      // update position
      this.style.x += this.vx,
      this.style.y += this.vy

      // check collision bottom
      if (this.style.y + this.vy >= floorY) {
        this.style.y = floorY
        this.vy = -this.vy * bounciness
      }

      // check collision left
      if (this.style.x + this.vx <= 0) {
        this.style.x = 0
        this.vx = -this.vx * bounciness
      }

      // check collision right
      if (this.style.x + this.vx >= device.width) {
        this.style.x = device.width
        this.vx = -this.vx * bounciness
      }

      // scale down
      this.style.scale *= lifeSpeed //0.999 //lifeSpeed

      // kill particle when life ends is handled by grid
      // if (sprite.scale.x <= 0.001) {}
    }
  }

})
