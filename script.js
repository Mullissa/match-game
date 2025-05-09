//Global variables

let gameWon = false;
let gameLost = false;
let startTime;
let elapsedTime = 0;
let timerInterval;
let isTimerRunning = false;
let gameStarted = false;
const timerDisplay = document.getElementById("timer");
const TOTAL_PAIRS = 6;
let seconds = 30;
let minutes = 0;

//card logic

function createNewCard() {
  /* Step 1: Create a new div element and assign it to a variable called cardElement. */
  const cardElement = document.createElement("div");
  /* Step 2: Add the "card" class to the variable 'cardElement' from the previous step. */
  cardElement.classList.add("card");
  /* Step 3: Write the HTML for the children of the card element (card-down and card-up) as a normal string and assign it as the innerHTML of cardElement. */
  cardElement.innerHTML =
    '<div class="card-down"></div>' + '<div class="card-up"></div>';
  /* Step 4: Return the cardElement. */
  return cardElement;
}
createNewCardTest();

function appendNewCard(parentElement) {
  /* Step 1: Create a new card by calling createNewCard() and assign it to a variable named cardElement. */
  const cardElement = createNewCard();
  /* Step 2: Append the card element to the parentElement (making the card element a "child").  */
  parentElement.appendChild(cardElement);
  /* Step 3: Return the card element. */
  return cardElement;
}
appendNewCardTest();

function shuffleCardImageClasses() {
  /* Step 1: Create a new array that contains two of each image class string in order (e.g. "image-1", "image-1", "image-2", "image-2"...). Store the array in a variable called 'cardClasses'.  */
  /* Step 2: We're going to use a library to randomly "shuffle" the array we created. The library is called "underscore.js" because it uses an "_" character as an object to contain helper methods. Load underscore.js in your HTML via the CDN then open up the documentation linked below to learn how to use the 'shuffle' method.  
   
  CDN: https://cdnjs.com/libraries/underscore.js/1.4.1
  Shuffle: https://www.tutorialspoint.com/underscorejs/underscorejs_shuffle.htm 
 
  NOTE: Ignore the "require" syntax shown in the documentation as this is for non-browser environments. The '_' variable will already be available to you from loading the CDN. */
  /* Step 3: Return the shuffled array of class names. */
  let cardClasses = [
    "image-1",
    "image-1",
    "image-2",
    "image-2",
    "image-3",
    "image-3",
    "image-4",
    "image-4",
    "image-5",
    "image-5",
    "image-6",
    "image-6",
  ];
  cardClasses = _.shuffle(cardClasses);
  return cardClasses;
}
shuffleCardImageClassesTest();

function createCards(parentElement, shuffledImageClasses) {
  /* Step 1: Make an empty array to hold our card objects. */
  const cards = [];
  /* Step 2: Write a for loop that loops 12 times to create the 12 cards we need. */
  for (let i = 0; i < 12; i++) {
    const currentCard = appendNewCard(parentElement);
    const imageClassToAdd = shuffledImageClasses[i];
    currentCard.classList.add(imageClassToAdd);
    const cardObject = {
      index: i,
      element: currentCard,
      imageClass: imageClassToAdd,
    };
    cards.push(cardObject);
  }
  return cards;
  /* Step 2(a): Use appendNewCard to create/append a new card and store the result in a variable. */
  /* Step 2(b): Add an image class to the new card element using shuffledImageClasses[i]. */
  /* Step 2(c): Append a new object to the card object array. The object should contain the following properties:
			"index" -- Which iteration of the loop this is.
			"element" -- The DOM element for the card.
			"imageClass" -- The string of the image class on the card. */
  /* Step 3: Return the array of 12 card objects. */
}
createCardsTest();

function doCardsMatch(cardObject1, cardObject2) {
  /* Step 1: Determine if two cards match. Remember the properties of our card objects from the createCards() function: index, element, and imageClass. */
  if (cardObject1.imageClass === cardObject2.imageClass) {
    return true;
  } else {
    return false;
  }
}

doCardsMatchTest();

/* The 'counters' object below is used as a dictionary to store our counter names and their respective values. Do you remember using objects as dictionaries? If not, go back to that video lesson in HQ to review. This object is empty for now but we'll fill it up in the following function. */
let counters = {};

function incrementCounter(counterName, parentElement) {
  /* Step 1: If the 'counterName' property is not defined in the 'counters' object, initialize it with a value of 0. */
  if (!counters.hasOwnProperty(counterName)) {
    counters[counterName] = 0;
  }
  /* Step 2: Increment the counter for 'counterName'. */
  counters[counterName]++;
  /* Step 3: Change the HTML within 'parentElement' to display the new counter value. */
  parentElement.innerText = counters[counterName];
}
incrementCounterTest();

/* The 'onCardFlipped' function below will be called each time the user flips a card. The 'lastCardFlipped' variable is used to remember the first card flipped while we wait for the user to flip another card. We need to keep track of this value to determine if the two cards flipped match or not. 'lastCardFlipped' should be reset to 'null' each time a second card is flipped. */
let lastCardFlipped = null;

function onCardFlipped(newlyFlippedCard) {
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }
  /* Step 1: Use the 'incrementCounter' function to add one to the flip counter UI.  */
  const flipCounterElement = document.getElementById("flip-count");
  incrementCounter("flips", flipCounterElement);
  /* Step 2: If 'lastCardFlipped' is null (this is the first card flipped), update 'lastCardFlipped' and return (nothing else to do) */
  if (lastCardFlipped === null) {
    lastCardFlipped = newlyFlippedCard;
    return;
  }
  /* If the above condition was not met, we know there are two cards flipped that should be stored in 'lastCardFlipped' and 'newlyFlippedCard', respectively. */
  /* Step 3: If the cards don't match, remove the "flipped" class from each, reset 'lastCardFlipped' to null, and use a 'return' to exit the function. Remember that newlyFlippedCard and lastCardFlipped are both objects made with the createCards function. This means that, to access each card's classList, you must access the card object's .element property first!  */
  if (!doCardsMatch(newlyFlippedCard, lastCardFlipped)) {
    newlyFlippedCard.element.classList.remove("flipped");
    lastCardFlipped.element.classList.remove("flipped");
    lastCardFlipped = null;
    return;
  }
  /* Step 4: Now we have two matching cards. Increment the match counter and optionally add a "glow" effect to the matching cards. */
  const matchCounterElement = document.getElementById("match-count");
  incrementCounter("matches", matchCounterElement);
  newlyFlippedCard.element.classList.add("glow");
  lastCardFlipped.element.classList.add("glow");
  /* Step 5: Play either the win audio or match audio based on whether the user has the number of matches needed to win. Both sounds have been loaded in provided.js as matchAudio and winAudio, respectively. */
  if (counters["matches"] === TOTAL_PAIRS && !gameLost) {
    gameWon = true;
    stopTimer();
    displayWinMessage(); // Call the dedicated function
  } else {
    matchAudio.play();
  }
  /* Step 6: Reset 'lastCardFlipped' to null */
  lastCardFlipped = null;
}

//Timer Logic

function updateTimerDisplay() {
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");
  timerDisplay.innerText = `Time: ${formattedMinutes}:${formattedSeconds}`;

  if (minutes === 0 && seconds === 0 && isTimerRunning) {
    stopTimer();
    gameOver();
  }
}

function startTimer() {
  if (!isTimerRunning) {
    isTimerRunning = true;
    startTime = Date.now();
    timerInterval = setInterval(() => {
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        minutes--;
        seconds = 59;
      } else {
        stopTimer();
        gameOver();
      }
      updateTimerDisplay();
      elapsedTime = Date.now() - startTime;
    }, 1000);
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
}

function gameOver() {
  if (!gameWon && !gameLost) {
    gameLost = true;
    isTimerRunning = false;
    displayLoseMessage();
    const cards = document.querySelectorAll(".card:not(.matched)");
    cards.forEach((card) => {
      card.removeEventListener("click", clickAudio);
      card.classList.add("disabled");
    });
  }
}

/* This function should remove all children from the #card-container, reset the flip and match counts displayed in the HTML, reset the counters dictionary to an empty object, reset lastCardFlipped to null, and set up a new game. */
function resetGame() {
  gameWon = false;
  gameLost = false;
  /* Step 1: Get the card container by its id and store it in a variable. */
  const cardContainer = document.getElementById("card-container");
  /* Step 2: Clear all the cards by using a while loop to remove the first child of the card container as long as a first child exists.
	See "To remove all children from an element:" in the Examples section of the MDN removeChild documentation -> https://mzl.la/3bklFxP */
  while (cardContainer.firstChild) {
    cardContainer.removeChild(cardContainer.firstChild);
  }
  /* Step 3: Get the HTML elements that display the flip and match counts and reset their inner text to 0. */
  const flipCountElement = document.getElementById("flip-count");
  const matchCountElement = document.getElementById("match-count");
  flipCountElement.innerText = 0;
  matchCountElement.innerText = 0;

  /* Step 4: Reassign the value of the `counters` dictionary to an empty object  */
  counters = {};
  /* Step 5: Set lastCardFlipped back to null. */
  lastCardFlipped = null;
  stopTimer();
  elapsedTime = 0;
  seconds = 30;
  minutes = 0;
  updateTimerDisplay(0, 0);
  gameStarted = false;
  const winMessage = document.querySelector(".win-message");
  if (winMessage) {
    winMessage.remove();
  }
  const gameOverMessage = document.querySelector(".game-over-message");
  if (gameOverMessage) {
    gameOverMessage.remove();
  }
  const cards = document.querySelectorAll(".card.disabled");
  cards.forEach((card) => {
    card.classList.remove("disabled");
    card.addEventListener("click", clickAudio);
  });

  /* Step 6: Set up a new game. */
  updateTimerDisplay();
  setUpGame();
}

function displayWinMessage() {
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) {
    // Remove any existing win or game over messages
    const existingWinMessage = document.querySelector(".win-message");
    if (existingWinMessage) {
      existingWinMessage.remove();
    }
    const existingGameOverMessage =
      document.querySelector(".game-over-message");
    if (existingGameOverMessage) {
      existingGameOverMessage.remove();
    }

    const winMessage = document.createElement("div");
    winMessage.classList.add("win-message");
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const finalMinutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const finalSeconds = String(totalSeconds % 60).padStart(2, "0");
    winMessage.textContent = `Congratulations! You won in ${finalMinutes}:${finalSeconds}!`;
    winMessage.style.fontSize = "2em";
    winMessage.style.color = "green";
    winMessage.style.textAlign = "center";
    gameContainer.prepend(winMessage);
  }
}

function displayLoseMessage() {
  const gameContainer = document.getElementById("game-container");
  if (gameContainer) {
    // Remove any existing win or game over messages
    const existingWinMessage = document.querySelector(".win-message");
    if (existingWinMessage) {
      existingWinMessage.remove();
    }
    const existingGameOverMessage =
      document.querySelector(".game-over-message");
    if (existingGameOverMessage) {
      existingGameOverMessage.remove();
    }

    const gameOverMessage = document.createElement("div");
    gameOverMessage.classList.add("game-over-message");
    gameOverMessage.textContent = "Loser! Game Over.";
    gameOverMessage.style.fontSize = "2em";
    gameOverMessage.style.color = "red";
    gameContainer.prepend(gameOverMessage);
  }
}

// ⛔️ Set up the game. Do not edit below this line! ⛔
setUpGame();
