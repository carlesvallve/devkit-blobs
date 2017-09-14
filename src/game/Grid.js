import device
import ui.View
import ui.TextView
import ui.ImageView
import ui.resource.Image as Image

import src.lib.soundcontroller as soundcontroller;
import src.lib.geometry as geometry
import src.lib.tileutils as tileutils
import src.lib.clusters as clusters

import src.game.Player as Player;
import src.game.Bubble as Bubble;
import src.game.Tile as Tile
import src.game.ExplosionParticle as ExplosionParticle

exports = Class(ui.ImageView, function (supr) {

  // =========================================================================
  // Game global variables
  // (Mainly used in order to achieve code splitting until we better understand
  // the engine modules and scopes)
  // =========================================================================

  GLOBAL.sound = soundcontroller.getSound()

  GLOBAL.tileImages = [
    //new Image({url: "resources/images/bubble-red.png"}),
    //new Image({url: "resources/images/bubble-blue.png"}),
    new Image({url: "resources/images/bubble-green.png"}),
    new Image({url: "resources/images/bubble-magenta.png"}),
    new Image({url: "resources/images/bubble-yellow.png"}),
  ]

  GLOBAL.playerImages = [
    //new Image({url: "resources/images/ninja-idle-red.png"}),
    //new Image({url: "resources/images/ninja-idle-blue.png"}),
    new Image({url: "resources/images/ninja-idle-green.png"}),
    new Image({url: "resources/images/ninja-idle-magenta.png"}),
    new Image({url: "resources/images/ninja-idle-yellow.png"}),
  ]

  // Game states
  GLOBAL.gamestates = { init: 0, ready: 1, shootbubble: 2, removecluster: 3, gameover: 4, restart: 5 };
  GLOBAL.gamestate = gamestates.init

  // Level data
  const size = device.width - 20
  const tileSize = size / 18

  GLOBAL.level = {
    x: 20,
    y: 30,
    width: size - 20,
    height: device.height - 400,

    columns: 18,                  // Number of tile columns
    rows: 16,                     // Number of tile rows
    tilewidth: tileSize, //40,    // Visual width of a tile // 40
    tileheight: tileSize, //40,   // Visual height of a tile
    rowheight: tileSize,          // Height of a row
    radius: tileSize / 2,         // Bubble collision radius

    tiles: [],                    // The two-dimensional tile array
    particles: [],
    rowoffset: 0,
    turncounter: 0,
    score: 0,
  }


  // =========================================================================
  // Main class methods
  // =========================================================================

  this.init = (opts) => {
    opts = merge(opts, {
      x: 0,
      y: 0,
      width:  size,
      height: device.height - 400,
      backgroundColor: null,
    })

    supr(this, 'init', [opts])

    this.tick = (dt) =>   {
      updatePlayer(dt)
      updateBubble(dt)
      updateParticles(dt)
    }

    this.shoot = (vec) => {
      shootBubble(vec)
    }

    this.movePlayer = (vec) => {
      movePlayer(vec)
    }

    newGame()
  }


  // =========================================================================
  // Initialization
  // =========================================================================

  const newGame = () => {
    setGameState(gamestates.init);

    createLevel()

    const type = tileutils.getExistingColor()
    createPlayer(type)
    createBubble(type)

    setGameState(gamestates.ready);
  }


  const createLevel = () => {
    level.score = 0;
    level.turncounter = 0;
    level.rowoffset = 0;
    level.tiles = []
    level.particles = []

    // Initialize the two-dimensional tile array
    for (var i=0; i<level.columns; i++) {
      level.tiles[i] = [];
      for (var j=0; j<level.rows; j++) {
        // Define a tile type and a shift parameter for future animation
        level.tiles[i][j] = this.addSubview(new Tile({ x: i, y: j, type: -1, shift: 0, size: level.tilewidth, image: null }))
      }
    }

    tileutils.setRandomLevel()
  }


  const createPlayer = (type) => {
    this.player = this.addSubview(new Player({
      type: type, image: playerImages[type], size: 96,
      x: this.style.width / 2, y: this.style.height
    }))
  }


  const createBubble = (type) => {
    this.bubble = this.addSubview(new Bubble({
      type: type, image: tileImages[type], size: level.tilewidth * 1, // 0.8
      x: this.player.style.x - 28, y: this.player.style.y - 25
    }))
  }


  // =========================================================================
  // Game logic
  // =========================================================================

  const setGameState = (newgamestate) => {
    gamestate = newgamestate;
  }


  const updateScore = (points) => {
    level.score += points
    this.emit('game:score', level.score)
  }


  const movePlayer = (vec) => {
    this.player.moveInDirection(vec.x > 0 ? 1 : -1)
  }

  const updatePlayer = (dt) => {
    if (!this.player) { return }
    this.player.update(dt)
  }


  const shootBubble = (vec) => {
    this.bubble.shoot(vec)
    setGameState(gamestates.shootbubble);
  }


  const updateBubble = (dt) => {
    if (!this.bubble) { return }
    const bubblePos = { x: this.player.style.x - 25, y: this.player.style.y - 25 }
    this.bubble.update(dt, bubblePos, snapBubble)
  }


  // Snap bubble to the grid
  const snapBubble = () => {
    const cluster = this.bubble.snap(checkGameOver)

    // if we made a cluster, remove it and pick next bubble
    if (cluster && cluster.length >= 3) {
      // Remove the cluster
      setGameState(gamestates.removecluster);
      removeCluster(cluster)
      nextBubble();
      return
    }

    // check for game over in case we have wiped all tiles
    if (checkGameOver()) {
        return;
    }

    // No cluster found,
    // so update the game turn and add more bubbles
    updateGameTurn()
    nextBubble();
  }


  const updateGameTurn = () => {
    window.setTimeout(() => {
      // No clusters found
      level.turncounter++;
      if (level.turncounter >= tileImages.length) {
        level.turncounter = 0;

        // Add a row of bubbles
        sound.play('invader');
        tileutils.addBubbles();

        // update row offset
        level.rowoffset = (level.rowoffset + 1) % 2;

        checkGameOver()
      }
    }, 300)
  }


  const nextBubble = () => {
    // Set a new color for player and bubble
    const newType = tileutils.getExistingColor()
    this.player.setType(newType)
    this.bubble.setType(newType)
    //this.bubble.locate(this.player.style.x + 400, this.player.style.y)
    setGameState(gamestates.ready);

    //device.width / 2 - 40, y: device.height - 490
    //device.width / 2 - 42, y: device.height - 452
  }


  const removeCluster = (cluster) => {
    const score = clusters.removeCluster(cluster, createExplosion)

    // Find floating clusters
    const floatingclusters = clusters.findFloatingClusters();
    const bonusScore = clusters.removeFloatingClusters(floatingclusters, createExplosion)

    // update score
    updateScore(score + bonusScore)

    // check for game over
    var tilefound = false
    for (var i = 0; i < level.columns; i++) {
      for (var j = 0; j < level.rows; j++) {
        if (level.tiles[i][j].type != -1) {
          tilefound = true;
          break;
        }
      }
    }

    if (tilefound) {
      setGameState(gamestates.ready);
    } else {
      // No tiles left, game over
      //setGameState(gamestates.gameover);
      gameOver()
    }
  }


  // =========================================================================
  // Explosions
  // =========================================================================

  const createExplosion = (tile, options) => {
    const defaultOptions = {
      max: 1,
      floorY: device.height - 422,
      gravity: 0.5,
      radius: 15,
      bounciness: 0.75,
      lifeSpeed: 0.997 + Math.random() * 0.002
    }

    options = merge(defaultOptions, options)

    for (let i = 0; i < options.max; i++) {
      const particle = this.addSubview(new ExplosionParticle(merge(
        { type: tile.type, image: tileImages[tile.type], size: 15 + Math.random() * 15,
            x: tile.style.x, y: tile.style.y
        }, options)))
      level.particles.push(particle)
    }
  }


  const updateParticles = (dt) => {
    for (let i = 0; i < level.particles.length; i++) {
      const particle = level.particles[i]
      particle.update(dt)

      // kill particle when her life ends and remove it from array
      // I wonder why this number has to be so high (?)
      if (particle.style.scale <= 0.6) {
        particle.removeFromSuperview()
        level.particles.splice(i,1)
        i--
      }
    }
  }

  // =========================================================================
  // Gameover
  // =========================================================================

  const checkGameOver = () => {
    for (var i=0; i<level.columns; i++) {
      // Check if there are bubbles in the bottom row
      if (level.tiles[i][level.rows-1].type != -1) {
        // Game over
        window.setTimeout(() => {
          nextBubble();
          gameOver()
        }, 500)
        return true;
      }
    }
    return false;
  }


  const gameOver = () => {
    sound.play('break')

    // iterate all tiles and make them explode
    for (var j=0; j< level.rows; j++) {
      for (var i=0; i < level.columns; i++) {
        const tile = level.tiles[i][j]
        if (tile.type != -1) {
          createExplosion(tile, { gravity: 0, bounciness: 1 })
          tile.setType(-1)
        }
      }
    }

    // display gameover message
    this.gameoverMessage = new ui.TextView({
      superview: this,
      x: 0,
      y: -200 + (device.height - 450) / 2,
      width: device.width - 0,
      height: 400,
      autoSize: false,
      size: 100,
      verticalAlign: 'middle',
      textAlign: 'center',
      multiline: false,
      color: '#000',
      backgroundColor: null,
      text: 'GAME OVER',

      fontFamily: 'Verdana',
      fontWeight: 900,
      shadowColor: '#333',
      shadowWidth: 4
    })

    // gameover music
    sound.play('pianomusic');
    sound.stop('levelmusic');

    // click anywhere to play again
    setGameState(gamestates.gameover);
    window.setTimeout(() => {
      setGameState(gamestates.restart);
    }, 2000)
  }

})
