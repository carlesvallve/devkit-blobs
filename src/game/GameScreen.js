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
    let hasMoved = false

    this.on('InputStart', function (event, point) {
      pos = point
      hasMoved = false
    })

    // mousemove
    this.on('InputMove', function (event, point) {
      if (gamestate !== gamestates.ready) { return }
      if (pos === null) { return }

      const vec = { x: point.x - pos.x, y: point.y - pos.y }

      if (vec.y > -8) { return }

      const dist = Math.sqrt( vec.x * vec.x + vec.y * vec.y )
      if (dist <= 13) { return }

      this.game.grid.shoot(vec)

      hasMoved = true
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

      // console.log('>>> point:', point, 'pos:', pos)
      // const vec = { x: point.x - pos.x, y: point.y - pos.y }
      // const dist = Math.sqrt( vec.x * vec.x + vec.y * vec.y )
      //
      // console.log('>>>', vec, dist)

      if (!hasMoved) {
        console.log('move the player instead of shooting!')
        this.game.grid.movePlayer(point.x)
      }
    })

    // mouseout
    this.on('InputOut', function (event) {
      pos = null
    })
  }

})
