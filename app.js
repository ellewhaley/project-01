document.addEventListener('DOMContentLoaded', () => {

  const grid = document.querySelector('.grid')
  const score = document.querySelector('.score')
  const lives = document.querySelector('.lives')
  const endScore = document.querySelector('.end-score')
  const restart = document.querySelector('.restart')
  const gameOver = document.querySelector('.game-over')
  const width = 16
  const squares = []
  let gameInPlay = true
  let spaceship = 249
  let alienMove = 0
  let scoreTotal = 0
  let loseLife = 3
  let alienArray = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43
  ]

  // **************************** GRID *****************************

  for(let i = 0; i < width * width; i++) {
    const square = document.createElement('div')
    squares.push(square)
    grid.appendChild(square)
  }

  // *************************** ALIENS ****************************

  // Add .alien class to all the elements in the array.
  alienArray.forEach(alienIndex => {
    squares[alienIndex].classList.add('alien')
  })

  // Aliens move right x4 down x1 left x4 down x1 (repeat)
  const alienMovement = [1, 1, 1, 1, width, -1, -1, -1, -1, width]
  const alienInterval = setInterval(() => { // set interval

    alienArray.forEach((alienIndex) => { // loop through
      squares[alienIndex].classList.remove('alien')
    })

    alienArray = alienArray.map((alienIndex) => alienIndex + alienMovement[alienMove])

    alienArray.forEach((alienIndex) => {
      squares[alienIndex].classList.add('alien')
    })

    alienMove++

    if (alienMove === alienMovement.length) alienMove = 0

    if (alienArray.some(alienIndex => alienIndex >= 240)) {
      return endGame()
    }
  }, 500)


  // ********************** SPACESHIP FUNCTION **********************

  squares[spaceship].classList.add('spaceship')

  function spaceshipInPlay() {
    const spaceshipPos = squares.find(square =>
      square.classList.contains('spaceship'))
    spaceshipPos.classList.remove('spaceship')
    squares[spaceship].classList.add('spaceship')

  }

  // ************************** BOMB FUNCTION ***********************

  function bombDrop() {
    const randomAlienInterval = setInterval(() => {
      let randomAlien = alienArray[Math.floor(Math.random() * alienArray.length)]

      const bombInterval = setInterval(() => {
        if (randomAlien + width <= 255) {
          squares[randomAlien].classList.remove('bomb')
          randomAlien += width
          squares[randomAlien].classList.add('bomb')
        } else {
          squares[randomAlien].classList.remove('bomb')
        }
        if (squares[randomAlien].classList.contains('spaceship')) {
          loseLife--
          if (loseLife === 0) {
            clearInterval(randomAlienInterval)
            clearInterval(bombInterval)
            return endGame()
          }
          lives.innerText = loseLife
          squares[randomAlien].classList.remove('bomb')
          clearInterval(bombInterval)
          squares[randomAlien].classList.add('spaceshipExp')
          setTimeout(() => {
            squares[randomAlien].classList.remove('spaceshipExp')
          }, 1000)
        }
      }, 500)
    }, 2000)
  }

  // ************************ END GAME FUNCTION ************************

  function endGame() {
    gameInPlay = false
    grid.style.display = 'none'
    clearInterval(alienInterval)
    lives.innerText = 'You Dead!'
    gameOver.innerText = 'Game Over!'
    endScore.innerText = `You Scored: ${scoreTotal}`
    restart.innerText = 'Play again?'
  }

  // ******************** SPACESHIP EVENT LISTENER ********************

  document.addEventListener('keydown', (e) => {
    if (gameInPlay) {
      switch(e.keyCode) {
        case 37:
          // left
          if(spaceship % width > 0) {
            spaceship--
            spaceshipInPlay()
          }
          break

        case 39:
          // right
          if(spaceship % width < width - 1) {
            spaceship++
            spaceshipInPlay()
          }
          break
      }
    } else return
  })

  // ******************** BULLETS EVENT LISTENER **********************

  document.addEventListener('keydown', (e) => {
    let bulletIndex = spaceship
    if (e.keyCode === 32) {
      const bulletInterval = setInterval(() => {
        if(bulletIndex - width >= 0) {
          squares[bulletIndex].classList.remove('bullet')
          bulletIndex -= width
          squares[bulletIndex].classList.add('bullet')
        } else {
          squares[bulletIndex].classList.remove('bullet')
        }
        if (squares[bulletIndex].classList.contains('alien')) {
          clearInterval(bulletInterval)
          squares[bulletIndex].classList.remove('bullet')
          scoreTotal++
          score.innerText = scoreTotal
          const alienPos = alienArray.indexOf(bulletIndex)
          alienArray.splice(alienPos, 1)
          squares[bulletIndex].classList.remove('alien')
          squares[bulletIndex].classList.add('alienExp')
          setTimeout(() => {
            squares[bulletIndex].classList.remove('alienExp')
          }, 500)
        }
      }, 200)
    }
  })

  bombDrop()
})
