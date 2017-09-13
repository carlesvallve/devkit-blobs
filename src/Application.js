// devkit imports
import device
import ui.StackView as StackView

// user imports
import src.lib.soundcontroller as soundcontroller
import src.game.TitleScreen as TitleScreen
import src.game.GameScreen as GameScreen


exports = Class(GC.Application, function () {

  this.initUI = function () {
    // Initialize sound system
    var sound = soundcontroller.getSound();

    // Set application scenes
    const titlescreen = new TitleScreen()
    const gamescreen = new GameScreen()

    // Add a new StackView to the root of the scene graph
    var rootView = new StackView({
      superview: this,
      x: 0,
      y: 0,
      width: device. width,
      height: device.height,
      clip: true,
      scale: 1
    })

    // create title screen
    rootView.push(titlescreen);

    // start the game when pressing play button
    titlescreen.on('title:start', function () {
      sound.play('click');
      gamescreen.game.emit('game:start');
      rootView.push(gamescreen);
    })

    // end the game when pressing back button
    gamescreen.ui.on('game:end', function () {
      sound.play('click');
      gamescreen.game.emit('game:end')
      rootView.pop();
    })
  }
})
