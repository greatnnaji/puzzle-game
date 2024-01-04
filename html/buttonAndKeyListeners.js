//KEY CODES
//should clean up these hard-coded key codes
const ENTER = 13
const RIGHT_ARROW = 39
const LEFT_ARROW = 37
const UP_ARROW = 38
const DOWN_ARROW = 40

function handleKeyDown(e) {

  //console.log("keydown code = " + e.which)

  let dXY = 5; //amount to move in both X and Y direction
  if (e.which == UP_ARROW && movingBox.y >= dXY)
    movingBox.y -= dXY //up arrow
  if (e.which == RIGHT_ARROW && movingBox.x + movingBox.width + dXY <= canvas.width)
    movingBox.x += dXY //right arrow
  if (e.which == LEFT_ARROW && movingBox.x >= dXY)
    movingBox.x -= dXY //left arrow
  if (e.which == DOWN_ARROW && movingBox.y + movingBox.height + dXY <= canvas.height)
    movingBox.y += dXY //down arrow

  let keyCode = e.which
  if (keyCode == UP_ARROW | keyCode == DOWN_ARROW) {
    //prevent browser from using these with text input drop downs
    e.stopPropagation()
    e.preventDefault()
  }

}

function handleKeyUp(e) {
//  console.log("key UP: " + e.which)
  if (e.which == RIGHT_ARROW | e.which == LEFT_ARROW | e.which == UP_ARROW | e.which == DOWN_ARROW) {
    let dataObj = {
      x: movingBox.x,
      y: movingBox.y
    }
    //create a JSON string representation of the data object
    let jsonString = JSON.stringify(dataObj)
    //DO NOTHING WITH THIS DATA FOR NOW


  }
  if (e.which == ENTER) {
    getPuzzle() //treat ENTER key like you would a getPuzzle
    document.getElementById('userTextField').value = ''

  }

  e.stopPropagation()
  e.preventDefault()

}

function solvePuzzle(){
  let textDiv = document.getElementById("text-area")
  textDiv.innerHTML = ''
  bubbleSortY()//sort the y-axis
  let array = getArrayofWords()
  let trimArr = getTrimmedArrayofWords()
  //make a new array to store lines in order of how they will get printed
  let linesArray = getLinesArray(array)//gets stored with an extra space at the end of each line so i will trim (not neccesary)
  //compare current puzzle words to original puzzle words and then return what color we should use according to that comparison
  let col = getColor(trimArr)
  //print out lines array to textarea line by line
  for(let line of linesArray){
    line.trim()
    textDiv.innerHTML += `<p>${line}</p>`
  }
  let ArrayOfTextDivElements = document.querySelectorAll("p")//store all puzzle words by theur paragraph element
  let ArrayofTextDivsGotten = [...ArrayOfTextDivElements].map(v => v.innerText)
  for(let j=0; j < ArrayofTextDivsGotten.length; j++){
    if(col == 0){
      ArrayOfTextDivElements[j].style.color = "red"
    }else if(col == 1){
      ArrayOfTextDivElements[j].style.color = "green"
    }
  }
  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {
    let userRequestObj = {text: userText}
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''
   
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}

function getPuzzle() {
  let userText = document.getElementById('userTextField').value
  if (userText && userText != '') {
    let textDiv = document.getElementById("text-area")
	  textDiv.innerHTML = textDiv.innerHTML + `<p> ${userText}</p>`
    textDiv.innerHTML = userText
    let userRequestObj = {text: userText}
    let userRequestJSON = JSON.stringify(userRequestObj)
    document.getElementById('userTextField').value = ''

    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        //we are expecting the response text to be a JSON string
        let responseObj = JSON.parse(this.responseText)
        if(responseObj.fileLines){
          arrayOfTexts(responseObj.fileLines)
          let arrayOfText = splitText(responseObj.fileLines)
          console.log("puzzleWords: " + randomizeArray(arrayOfText))
          console.log("typeof: " + typeof this.responseText)
          //re-initialize words and the copy of Words Array
          words = []
          copyWords = []
          
          //store each individual text displayed on the canvas in our words array
          for(let string of arrayOfText){
            words.push({word: string, x: 50, y: 50})//doesn't matter what the starting values are because they get randomized
          }
          randomWordLocation()
          //using a loop to copy each individual word object instead of assigning it as this alters the actual words object
          //this way copy Words acts as a duplicate words object array and we never have to directly alter words
          for(let index of words){
            copyWords.push(index)
          }
      }
  }
        drawCanvas()
    }
    xhttp.open("POST", "userText") //API .open(METHOD, URL)
    xhttp.send(userRequestJSON) //API .send(BODY)
  }
}
