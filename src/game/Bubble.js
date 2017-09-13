import device;
import ui.ImageView

import src.lib.soundcontroller as soundcontroller;
import src.lib.geometry as geometry
import src.lib.tileutils as tileutils
import src.lib.clusters as clusters

exports = Class(ui.ImageView, function (supr) {
  this.init = function (opts) {
    opts = merge(opts, {
      width: opts.size,
      height: opts.size,
      offsetX: -opts.size / 2,
      offsetY: -opts.size / 2,
      anchorX: opts.size / 2,
      anchorY: opts.size / 2,
      image: opts.image
    })

    supr(this, 'init', [opts]);

    this.type = opts.type
    this.speed = 1
    this.angle = 0
    this.moving = false
    this.initialized = false // means bubble is still hold by the player

    // ======================================================================
    // shoot
    // ======================================================================

    // create bubble of current player type at player position
    // move bubble in inc and make it rebound with walls
    this.shoot = (vec) => {
      sound.play('throw');


      // Get the mouse angle // Convert range to 0, 360 degrees
      var angle = geometry.radToDeg(Math.atan2(-vec.y * 100, vec.x * 100))
      if (angle < 0) { angle = 180 + (180 + angle) }

      // Shoot the bubble in the direction of the mouse
      this.angle = angle
      this.speed = 1 //0.5
      this.moving = true
      this.initialized = true
    }


    // ======================================================================
    // update
    // ======================================================================

    this.update = (dt, origin, snapBubble) => {
      //console.log('updating bullet???', this)
      if (!this.initialized) {
        this.style.x = origin.x
        this.style.y = origin.y
        return
      }

      if (!this.moving) {
        return
      }

      // Move the bubble in the direction of the mouse
      this.style.x += dt * this.speed * Math.cos(geometry.degToRad(this.angle));
      this.style.y += dt * this.speed * -1*Math.sin(geometry.degToRad(this.angle));

      // Handle left and right collisions with the level
      if (this.style.x <= level.x) {
        sound.play('punch')
        // Left edge
        this.angle = 180 - this.angle
        this.style.x = level.x
      } else if (this.style.x >= level.x + level.width) {
        sound.play('punch')
        // Right edge
        this.angle = 180 - this.angle;
        this.style.x = level.x + level.width
      }

      // Collisions with the top of the level
      if (this.style.y <= level.y) {
          // Top collision
          this.style.y = level.y
          // TODO: emmit an event instead of using a clallback?
          snapBubble();
          return;
      }

      // Collisions with other tiles
      for (var i=0; i<level.columns; i++) {
        for (var j=0; j<level.rows; j++) {
          var tile = level.tiles[i][j];

          // Skip empty tiles
          if (tile.type < 0) { continue; }

          // Check for intersections
          var coord = tileutils.getTileCoordinate(i, j)

          if (geometry.circleIntersection(
            this.style.x, // + level.tilewidth/2,
            this.style.y, // + level.tileheight/2,
            level.radius, // + dt * this.speed,
            coord.tilex, // + level.tilewidth/2,
            coord.tiley, // + level.tileheight/2,
            level.radius, // + dt * this.speed
          )) {
              // Intersection with a level bubble
              // TODO: emmit an event instead of using a clallback?
              snapBubble();
              return;
          }
        }
      }
    }

    // ======================================================================
    // Snap
    // ======================================================================

    // Snap bubble to the grid
    this.snap = () => {
      this.moving = false
      sound.play('punch');

      // Get the grid position
      var centerx = this.style.x // + level.tilewidth/2;
      var centery = this.style.y // + level.tileheight/2;
      var gridpos = tileutils.getGridPosition(centerx, centery);

      // Make sure the grid position is valid
      if (gridpos.x < 0) { gridpos.x = 0; }
      if (gridpos.x >= level.columns) { gridpos.x = level.columns - 1; }
      if (gridpos.y < 0) { gridpos.y = 0; }
      if (gridpos.y >= level.rows) { gridpos.y = level.rows - 1; }

      // Check if the tile is empty
      var addtile = false;
      if (level.tiles[gridpos.x][gridpos.y].type != -1) {
        // Tile is not empty, shift the new tile downwards
        for (var newrow = gridpos.y + 1; newrow < level.rows; newrow++) {
          if (level.tiles[gridpos.x][newrow].type == -1) {
            gridpos.y = newrow;
            addtile = true;
            break;
          }
        }
      } else {
        addtile = true;
      }

      // Add the tile to the grid
      if (addtile) {
        // Hide the player bubble
        this.hide()

        // Set the tile
        level.tiles[gridpos.x][gridpos.y].setType(this.type)

        // Find clusters
        cluster = clusters.findCluster(gridpos.x, gridpos.y, true, true, false);
        return cluster
      }

      return null
    }


    // ======================================================================
    // Next
    // ======================================================================

    this.setType = (newType) => {
      //this.style.x = device.width / 2 - 42
      //this.style.y = device.height - 452
      this.type = newType;
      this.setImage(tileImages[newType])
      this.show()

      this.initialized = false
    }

    this.locate = (x, y) => {
      console.log(x, y)
      this.style.x = x //device.width / 2 - 42
      this.style.y = y //device.height - 452
    }

  }
})
