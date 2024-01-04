document.addEventListener('DOMContentLoaded', function() {
  //This is called after the browser has loaded the web page
  randomWordLocation()

  //add mouse down listener to our canvas object
  document.getElementById('canvas1').addEventListener('mousedown', handleMouseDown)
  //add listener to submit button
  document.getElementById('get_puzzle').addEventListener('click', getPuzzle)

  document.getElementById('solve_puzzle').addEventListener('click', solvePuzzle)

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keyup', handleKeyUp)

  drawCanvas()
})
