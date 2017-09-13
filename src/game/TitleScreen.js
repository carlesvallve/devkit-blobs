import device
import ui.ImageView
import ui.TextView

exports = Class(ui.ImageView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      x: 0,
      y: 0,
      width: device. width,
      height: device.height,
      backgroundColor: '#111'
    });

    supr(this, 'init', [opts])

    var startbutton = new ui.TextView({
      superview: this,
      x: 0,
      y: 0,
      width: device.width,
      height: device.height,
      autoSize: false,
      size: 48,
      verticalAlign: 'middle',
      textAlign: 'center',
      multiline: false,
      color: '#fff',
      backgroundColor: null,
      text: 'B L O B S',
      fontWeight: 700,
    });

    sound.play('pianomusic')

    startbutton.on('InputSelect', bind(this, function () {
      this.emit('title:start')
    }))
  }
})
