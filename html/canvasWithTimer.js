/*
Javascript example using an html <canvas> as the main
app client area.
The application illustrates:
-handling mouse dragging and release
to drag a strings around on the html canvas
-Keyboard arrow keys are used to move a moving box around

Here we are doing all the work with javascript.
(none of the words are HTML, or DOM, elements.
The only DOM element is just the canvas on which
where are drawing and a text field and button where the
user can type data

Mouse event handlers are being added and removed.

Keyboard keyDown handler is being used to move a "moving box" around
Keyboard keyUP handler is used to trigger communication with the
server via POST message sending JSON data

*/

//DATA MODELS
//Use javascript array of objects to represent words and their locations
let copyWords = []
let words = []
words.push({word: "I", x: 50, y: 50})
words.push({word: "like", x: 70, y: 50})
words.push({word: "javascript", x: 120, y: 50})

const canvas = document.getElementById('canvas1') //our drawing canvas

function getWordAtLocation(aCanvasX, aCanvasY) {
  //locate the word near aCanvasX,aCanvasY
  //Just use crude region for now.
  //should be improved to using length of word etc.

  //note you will have to click near the start of the word
  //as it is implemented now
  const context = canvas.getContext('2d')
  for (let i = 0; i < words.length; i++) {
    let wordWidth = context.measureText(words[i].word).width
    let wordHeight = 20
    //if it is greater than the starting word position but less than the 
    //starting position plus the width
    if((aCanvasX >= (words[i].x)) && (aCanvasX <= (words[i].x + wordWidth))){
      if((aCanvasY <= (words[i].y)) && (aCanvasY >= (words[i].y - wordHeight))){
        return words[i] 
      }
    }
  }
  return null
}


function drawCanvas() {
  /*
  Call this function whenever the canvas needs to be redrawn.
  */

  const context = canvas.getContext('2d')

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height) //erase canvas

  context.font = '20pt Arial'
  context.fillStyle = 'cornflowerblue'
  context.strokeStyle = 'blue'

  for (let i = 0; i < words.length; i++) {

    let data = words[i]
    context.fillText(data.word, data.x, data.y)
    context.strokeText(data.word, data.x, data.y)

  }
  context.stroke()
}

function randomWordLocation(){
  for(let i=0; i < words.length; i++){
    words[i].x = Math.floor(Math.random()*(canvas.width - 100)) + 50
    words[i].y = Math.floor(Math.random()*(canvas.height- 100)) + 50
  }
}

function splitText(arrayofSongLines){
  let arrayOfText = []
  let str = ''
  for(let index of arrayofSongLines){
      for(let char of index){
          if(char != ' '){
              str += char
          }else{
              arrayOfText.push(str)
              str = ''
          }
      }
      if(str != ''){
          arrayOfText.push(str)
        }
      str = ''
  }
  return arrayOfText
}

function randomizeArray(array){
  let randomArrayofText = []
  for(let i = array.length - 1; i >= 0; i--){
    randomArrayofText.push(array[i])
  }
    return '[' +randomArrayofText+ ']'
  }

function arrayOfTexts(arrayofSongLines){
  let arrayOfText = []
  let str = ''
  for(let index of arrayofSongLines){
      for(let char of index){
          if(char != ' '){
              str += char
          }else{
              arrayOfText.push(str)
              str = ''
          }
      }
      if(str != ''){
          arrayOfText.push(str)
          str = ''
        }
        arrayOfText.push(' ')//space tells us when we go to a new line
  }
}

//boolean array, 0 for false/red and 1 for true/green
function getColor(trimArr){
  let col = 0
  for(let i=0; i<words.length; i++){
    if(words[i].word === trimArr[i]){//if the order of text on canvas is the same as our original words array
      col = 1
    }else{
      col = 0
      break
    }
  }
  return col
}

function getLinesArray(array){
  let linesArray = []
  let str = ''
  for(let index of array){
    if(index != ' '){
      str += index + ' '//extra space is used to to make space between text but adds extra to the 
      //end of a line so we trim later on (not neccessary)
    }else{
      linesArray.push(str)
      str = ''
    }
  }
  //make sure we added all words 
  if(str != ''){
    linesArray.push(str)
  }
  return linesArray
}

function getArrayofWords(){
  let arr = []
  let array = []
  //sort array of words
  //loop through every word in a bounded y-axis and print out
  let strpoint = copyWords[0]
  for(let i=0; i<copyWords.length; i++){
    if(Math.abs(strpoint.y - copyWords[i].y) < 15){
      arr.push(copyWords[i])
    }else{
      if(arr.length > 1){
        bubbleSortX(arr)
      }
      arr.push(' ')
      for(let obj of arr){
        if(obj != ' '){
          array.push(obj.word)
        }else{
          array.push(' ')//tells us we are in a new line
        }
      }
      arr = []
      strpoint = copyWords[i]
      arr.push(strpoint)
    }
  }
  //making sure to check if our variable "arr" is empty at the end to 
  //ensure we are storing all our words
  if(arr.length > 0){
    bubbleSortX(arr)
    for(let obj of arr){
      array.push(obj.word)
    }
  }
  return array
}

function getTrimmedArrayofWords(){
  let arr = []
  let trimArr = []
  //loop through every word in a given bounded y-axis and store
  let strpoint = copyWords[0]
  for(let i=0; i<copyWords.length; i++){
    if(Math.abs(strpoint.y - copyWords[i].y) < 15){
      arr.push(copyWords[i])
    }else{
      if(arr.length > 1){
        bubbleSortX(arr)
      }
      arr.push(' ')//tells us we are in a new line
      for(let obj of arr){
        if(obj != ' '){
          trimArr.push(obj.word)
        }
      }
      arr = []
      strpoint = copyWords[i]
      arr.push(strpoint)
    }
  }
  //making sure to check if our variable "arr" is empty at the end to 
  //ensure we are storing all our words
  if(arr.length > 0){
    bubbleSortX(arr)
    for(let obj of arr){
      trimArr.push(obj.word)
    }
  }
  return trimArr
}

function bubbleSortX(arr){
  for(let i=0; i< arr.length -1; i++){
    for(let j=0; j < arr.length -i -1; j++){
      if(arr[j].x > arr[j+1].x){
        let temp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = temp
      }
    }
  }
}


function bubbleSortY(){
  for(let i=0; i< copyWords.length -1; i++){
    for(let j=0; j < copyWords.length -i -1; j++){
      if(copyWords[j].y > copyWords[j+1].y){
        let temp = copyWords[j]
        copyWords[j] = copyWords[j+1]
        copyWords[j+1] = temp
      }
    }
  }
}

