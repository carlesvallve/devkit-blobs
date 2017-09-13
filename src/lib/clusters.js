
// Find cluster at the specified tile location
exports.findCluster = (tx, ty, matchtype, reset, skipremoved) => {
    // Reset the processed flags
    if (reset) {
        resetProcessed()
    }

    // Get the target tile. Tile coord must be valid.
    var targettile = level.tiles[tx][ty]

    // Initialize the toprocess array with the specified tile
    var toprocess = [targettile]
    targettile.processed = true
    var foundcluster = []

    while (toprocess.length > 0) {
        // Pop the last element from the array
        var currenttile = toprocess.pop()

        // Skip processed and empty tiles
        if (currenttile.type == -1) {
            continue
        }

        // Skip tiles with the removed flag
        if (skipremoved && currenttile.removed) {
            continue
        }

        // Check if current tile has the right type, if matchtype is true
        if (!matchtype || (currenttile.type == targettile.type)) {
            // Add current tile to the cluster
            foundcluster.push(currenttile)

            // Get the neighbors of the current tile
            var neighbors = getNeighbors(currenttile)

            // Check the type of each neighbor
            for (var i=0; i<neighbors.length; i++) {
                if (!neighbors[i].processed) {
                    // Add the neighbor to the toprocess array
                    toprocess.push(neighbors[i])
                    neighbors[i].processed = true
                }
            }
        }
    }

    // Return the found cluster
    return foundcluster;
}


// Find floating clusters
exports.findFloatingClusters = () => {
  // Reset the processed flags
  resetProcessed()

  var foundclusters = []

  // Check all tiles
  for (var i=0; i<level.columns; i++) {
    for (var j=0; j<level.rows; j++) {
      const tile = level.tiles[i][j]

      if (!tile.processed) {
        // Find all attached tiles
        const foundcluster = this.findCluster(i, j, false, false, true);

        // There must be a tile in the cluster
        if (foundcluster.length <= 0) {
          continue
        }

        // Check if the cluster is floating
        let floating = true;
        for (var k=0; k<foundcluster.length; k++) {
          if (foundcluster[k].y == 0) {
            // Tile is attached to the roof
            floating = false
            break
          }
        }

        if (floating) {
          // Found a floating cluster
          foundclusters.push(foundcluster)
        }
      }
    }
  }

  return foundclusters
}


exports.removeCluster = (cluster, createExplosion) => {
  sound.play('break');

  resetRemoved();

  // Mark the tiles as removed
  for (var i = 0; i < cluster.length; i++) {
    const tile = cluster[i]
    createExplosion(tile)
    tile.setType(-1)

    // Set the removed flag
    tile.removed = true;
  }

  // return scored points
  const points = cluster.length * 100
  return points
}

exports.removeFloatingClusters = (floatingclusters, createExplosion) => {
  let points = 0

  if (floatingclusters.length > 0) {
    sound.play('break');
    // Setup drop animation
    for (var i = 0; i < floatingclusters.length; i++) {
      for (var j = 0; j < floatingclusters[i].length; j++) {
        const tile = floatingclusters[i][j];
        createExplosion(tile)
        tile.setType(-1)

        points += 10
      }
    }
  }

  // return scored points
  return points
}


// Reset the processed flags
const resetProcessed =() => {
  for (var i=0; i<level.columns; i++) {
    for (var j=0; j<level.rows; j++) {
      level.tiles[i][j].processed = false
    }
  }
}


// Reset the removed flags
const resetRemoved = () => {
  for (var i=0; i<level.columns; i++) {
    for (var j=0; j<level.rows; j++) {
      level.tiles[i][j].removed = false
    }
  }
}


// Neighbor offset table
const neighborsoffsets = [
  [[1, 0], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1]],  // Even row tiles
  [[1, 0], [1, 1], [0, 1], [-1, 0], [0, -1], [1, -1]]     // Odd row tiles
]


// Get the neighbors of the specified tile
const getNeighbors = (tile) => {
  var tilerow = (tile.y + level.rowoffset) % 2 // Even or odd row
  var neighbors = []

  // Get the neighbor offsets for the specified tile
  var n = neighborsoffsets[tilerow]

  // Get the neighbors
  for (var i=0; i<n.length; i++) {
    // Neighbor coordinate
    var nx = tile.x + n[i][0]
    var ny = tile.y + n[i][1]

    // Make sure the tile is valid
    if (nx >= 0 && nx < level.columns && ny >= 0 && ny < level.rows) {
        neighbors.push(level.tiles[nx][ny])
    }
  }

  return neighbors
}
