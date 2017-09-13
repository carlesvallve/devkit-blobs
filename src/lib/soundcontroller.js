import AudioManager;

exports.sound = null

exports.getSound = function () {
  if (!exports.sound) {
    exports.sound = new AudioManager({
      path: 'resources/audio',
      files: {
        levelmusic:  { volume: 0.4, background: true, loop: true },
        pianomusic:   { volume: 0.4, background: true, loop: true },
        click:        { background: false, volume: 1 },
        throw:        { background: false, volume: 0.4 },
        punch:        { background: false, volume: 0.6 },
        break:        { background: false, volume: 0.6 },
        invader:      { background: false, volume: 1 },
      }
    })
  }
  return exports.sound
}
