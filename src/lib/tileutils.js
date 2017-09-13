
// Randomize the tile matrix
exports.setRandomLevel = () => {
  // Create a level with random tiles
  for (var j=0; j< level.rows; j++) {
    var randomtile = this.randRange(0, tileImages.length - 1)
    var count = 0;
    for (var i=0; i < level.columns; i++) {
      if (count >= 2) {
        // Change the random tile
        var newtile = this.randRange(0, tileImages.length - 1)

        // Make sure the new tile is different from the previous tile
        if (newtile == randomtile) {
          newtile = (newtile + 1) % tileImages.length
        }
        randomtile = newtile
        count = 0
      }
      count++

      if (j < level.rows / 2) {
        level.tiles[i][j].setType(randomtile)
      } else {
        level.tiles[i][j].setType(-1)
      }

      this.locateTile(level.tiles[i][j], i, j)
    }
  }
}


// Adds a new row of bubbles to the tile matrix
exports.addBubbles = () => {
  // Move the rows downwards
  for (var i=0; i<level.columns; i++) {
    for (var j=0; j<level.rows-1; j++) {
      level.tiles[i][level.rows-1-j].setType(level.tiles[i][level.rows-1-j-1].type)
      //this.locateTile(level.tiles[i][level.rows-1-j], i, [level.rows-1-j-1])
    }
  }

  // Add a new row of bubbles at the top
  for (var i=0; i<level.columns; i++) {
    // Add random, existing, colors
    level.tiles[i][0].setType(this.getExistingColor())
    //this.locateTile(level.tiles[i][0], i, 0)
  }
}


// Get the closest grid position
// assumes that the x and y position is the center position of a bubble.
//It divides the y by the rowheight to get the row of the bubble in the 2d array.
//The column, gridx, is calculated using a similar method.
//Of course we have to compensate for the horizontal shift if it applies to the current row.
exports.getGridPosition = (x, y) => {
  var gridy = Math.floor(y / level.rowheight)

  // Check for offset
  var xoffset = 0
  if ((gridy + level.rowoffset) % 2) {
    xoffset = level.tilewidth / 2
  }
  var gridx = Math.floor((x - xoffset) / level.tilewidth)

  return { x: gridx, y: gridy }
}


// Get the tile coordinate
exports.getTileCoordinate = (column, row) => {
  var tilex = column * level.tilewidth

  // X offset for odd rows
  if (row % 2) {
      tilex += level.tilewidth / 2
  }

  var tiley = row * level.rowheight;
  return { tilex: level.x + tilex, tiley: level.y + tiley }
}


// draw tile on screen at given coords
exports.locateTile = (tile, i, j) => {
  // Calculate the tile coordinates
  var coord = this.getTileCoordinate(i, j)

  tile.style.x = coord.tilex // level.x + coord.tilex // + level.tilewidth * 0.1
  tile.style.y = coord.tiley // level.y + coord.tiley //  + level.tileheight * 0.1
}


// Get a random existing color
exports.getExistingColor = () => {
    const existingcolors = this.findColors();

    var bubbletype = 0;
    if (existingcolors.length > 0) {
        bubbletype = existingcolors[this.randRange(0, existingcolors.length-1)]
    }

    return bubbletype;
}


// Find the remaining colors
exports.findColors = () => {
  var foundcolors = [];
  var colortable = [];
  for (var i = 0; i < tileImages.length; i++) {
      colortable.push(false);
  }

  // Check all tiles
  for (var i=0; i<level.columns; i++) {
    for (var j=0; j<level.rows; j++) {
      var tile = level.tiles[i][j];
      if (tile.type >= 0) {
        if (!colortable[tile.type]) {
          colortable[tile.type] = true;
          foundcolors.push(tile.type);
        }
      }
    }
  }

  return foundcolors;
}


// Get a random int between low and high, inclusive
exports.randRange = (low, high) => {
    return Math.floor(low + Math.random()*(high-low+1))
}
