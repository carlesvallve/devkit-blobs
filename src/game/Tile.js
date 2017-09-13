import ui.ImageView

exports = Class(ui.ImageView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      width: opts.size,
      height: opts.size,
      offsetX: -opts.size / 2,
      offsetY: -opts.size / 2,
      anchorX: opts.size / 2,
      anchorY: opts.size / 2,
      image: opts.image,

    });

    supr(this, 'init', [opts])

    this.x = opts.x
    this.y = opts.y
    this.type = opts.type
    this.shift = opts.shift

    this.removed = false
    this.velocity = 0
    this.alpha = 1
    this.processed = false

    this.setType = (type) => {
      this.type = type
      this.setImage(type == -1 ? null : tileImages[type])
    }
  }
})
