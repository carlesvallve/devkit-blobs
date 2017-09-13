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
    });

    supr(this, 'init', [opts])

    this.header = new ui.TextView({
      superview: this,
      x: 0,
      y: 0,
      width: device.width,
      height: 200,
      autoSize: false,
      size: 48,
      verticalAlign: 'middle',
      textAlign: 'center',
      multiline: false,
      color: '#fff',
      backgroundColor: '#111',
      text: 'SCORE: 0',
    })

    this.credits = new ui.TextView({
      superview: this,
      x: 0,
      y: device.height - 200,
      width: device.width,
      height: 150,
      autoSize: false,
      size: 42,
      verticalAlign: 'middle',
      textAlign: 'center',
      multiline: false,
      color: '#fff',
      backgroundColor: '#111',
      text: 'BLOBS by Carles Vallve'
    })

    this.link = new ui.TextView({
      superview: this,
      x: 0,
      y: device.height - 80,
      width: device.width,
      height: 80,
      autoSize: false,
      size: 32,
      verticalAlign: 'top',
      textAlign: 'center',
      multiline: false,
      color: '#999',
      backgroundColor: '#111',
      text: 'snaptothegrid@gmail.com'
    })

    // link is really just the back button for now
    this.link.on('InputStart', bind(this, function () {
      this.emit('game:end')
    }));

    this.updateScore =(score) => {
      this.header.setText('SCORE: ' + score);
    }

  }
})

// this.startMessage = function() {
//   var that = this;
//   that.header.setText('');
//
//   animate(that.header).wait(500)
//   .then(function () {
//     that.header.setText('READY')
//   }).wait(500).then(function () {
//     that.header.setText('SET')
//   }).wait(500).then(function () {
//     that.header.setText('GO');
//   }).wait(500).then(function () {
//     that.header.setText('00:00')
//     //start game ...
//     //that.startGame()
//     //console.log('START', this)
//     that.emit('game:start')
//     //game_on = true;
//     //play_game.call(that)
//   });
// }
