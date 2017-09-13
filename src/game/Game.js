import device
import ui.ImageView
import src.lib.soundcontroller as soundcontroller
import src.game.Grid as Grid

exports = Class(ui.ImageView, function (supr) {
  this.init = (opts) => {
    opts = merge(opts, {
      x: 0,
      y: 200,
      width: device. width,
      height: device.height - 400,
      backgroundColor: '#333'
    });
    supr(this, 'init', [opts])
  }

  // start game
  this.on('game:start', () => {
    sound.stop('pianomusic');
    sound.play('levelmusic');
    createGrid()
  })

  // end game
  this.on('game:end', () => {
    sound.play('pianomusic');
    sound.stop('levelmusic');
    destroyGrid()
  })

  const createGrid = () => {
    this.grid = this.addSubview(new Grid())
    this.grid.on('game:score', (score) => {
      this.emit('game:score', score)
    })
  }

  const destroyGrid = () => {
    this.grid.removeFromSuperview()
  }
})
