
// Check if two circles intersect
exports.circleIntersection = (x1, y1, r1, x2, y2, r2) => {
  // Calculate the distance between the centers
  var dx = x1 - x2
  var dy = y1 - y2
  var len = Math.sqrt(dx * dx + dy * dy)

  if (len < r1 + r2) {
    // Circles intersect
    return true
  }

  return false
}

// Convert radians to degrees
exports.radToDeg = (angle) => {
  return angle * (180 / Math.PI)
}

// Convert degrees to radians
exports.degToRad = (angle) => {
  return angle * (Math.PI / 180)
}
