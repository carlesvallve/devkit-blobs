import ui.ImageView

exports = Class(ui.ImageView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      width: opts.size,
      height: opts.size,
      image: opts.image,
      offsetX: -opts.size / 2,
      offsetY: -opts.size / 1,
      anchorX: opts.size / 2,
      anchorY: opts.size / 2,
    })

    supr(this, 'init', [opts])

    this.type = opts.type

    this.targetX = this.style.x
    this.speed = 0.3; // from 0 to 1
    this.moving = false


    this.setType = (type) => {
      this.type = type
      this.setImage(type == -1 ? null : playerImages[type])
    }


    this.moveInDirection = (dir) => {
      if (this.moving) {
        return
      }

      const columnWidth = 100
      this.targetX = this.style.x + dir * columnWidth
      this.moving = true
    }


    this.update = (dt) => {
      // ease-out interpolate to target position
      const dx = (this.targetX - this.style.x) * this.speed
      this.style.x += dx

      // arrive to target position
      if (Math.abs(dx) < 1) {
        this.style.x = this.targetX
        this.moving = false
      }
    }

  }
})
