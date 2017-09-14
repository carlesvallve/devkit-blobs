import device
import ui.View
import ui.ImageView
import ui.resource.Image as Image

import src.lib.soundcontroller as soundcontroller
import src.game.GameUI as GameUI
import src.game.Game as Game


exports = Class(ui.ImageView, function (supr) {
  this.init = (opts) => {
    opts = merge(opts, {
      x: 0,
      y: 0,
      width: device. width,
      height: device.height,
      backgroundColor: '#fff'
    })
    supr(this, 'init', [opts])

    this.game = this.addSubview(new Game())
    this.ui = this.addSubview(new GameUI())

    this.game.on('game:score', (score) => {
      this.ui.updateScore(score)
    })

    setMouseEvents()
  }


  setMouseEvents = () => {
    let pos = null

    this.on('InputStart', function (event, point) {
      pos = point
    })

    // mousemove
    this.on('InputMove', function (event, point) {
      if (pos === null) { return }
      if (gamestate === gamestates.restart) {
          return
      }

      const vec = { x: point.x - pos.x, y: point.y - pos.y }
      const dist = Math.sqrt( vec.x * vec.x + vec.y * vec.y )
      if (dist <= 40) {
        //pos = null
        return
      }

      // we swiped horizontaly or in a up-down diagonal,
      // so move the player
      if (vec.y >= -40) {
        this.game.grid.movePlayer(vec)
        //pos = null
        return
      }

      // we swiped bottom-up,
      // so shoot a bubble
      if (gamestate === gamestates.ready) {
        this.game.grid.shoot(vec)
      }

      pos = null
    })

    // mouseup
    this.on('InputSelect', function (event, point) {
      pos = null

      // if is gameover, click anywhere to play again
      if (gamestate === gamestates.restart) {
        sound.play('click')
        this.game.emit('game:end')
        this.game.emit('game:start')

        return
      }
    })

    // mouseout
    this.on('InputOut', function (event) {
      pos = null
    })
  }

})
