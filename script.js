// DOM Elements
const player1Input = document.getElementById("player1-name");
const player2Input = document.getElementById("player2-name");
const startGameBtn = document.getElementById("start-game");
const gameArea = document.getElementById("game-area");
const playerSetup = document.getElementById("player-setup");
const currentPlayerDisplay = document.getElementById("current-player");
const inputField = document.getElementById("sentence-input");
const timerDisplay = document.getElementById("timer");
const wordCountDisplay = document.getElementById("word-count");
const result = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");

// Game State
let player1 = "";
let player2 = "";
let currentRound = 1;
let maxRounds = 3;
let currentPlayer = 1;
let playerScores = {
  1: { name: "", words: [], total: 0 },
  2: { name: "", words: [], total: 0 }
};

let timeLeft = 20; // seconds
let timerInterval = null;
let typingStarted = false;

startGameBtn.addEventListener("click", () => {
  player1 = player1Input.value.trim() || "Player 1";
  player2 = player2Input.value.trim() || "Player 2";

  playerScores[1].name = player1;
  playerScores[2].name = player2;

  updatePlayerDisplay();

  playerSetup.style.display = "none";
  gameArea.style.display = "block";
});

function updatePlayerDisplay() {
  currentPlayerDisplay.textContent = `Round ${currentRound} - ${playerScores[currentPlayer].name}'s turn`;
}

function updateWordCount() {
  const sentence = inputField.value;
  const words = sentence.match(/\b\w+\b/g);
  const wordCount = words ? words.length : 0;
  wordCountDisplay.textContent = `Words: ${wordCount}`;
}

function backgroundFade() {
  if (timeLeft > 10) {
    inputField.style.backgroundColor = "";
  } else if (timeLeft > 7) {
    inputField.style.backgroundColor = "#d4af37";
  } else if (timeLeft > 2) {
    inputField.style.backgroundColor = "#ffa500";
  } else {
    inputField.style.backgroundColor = "#8b0000";
  }
}

function startCountdown() {
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    backgroundFade();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Time's up!";
      inputField.disabled = true;

      const sentence = inputField.value.trim();
      const words = sentence.match(/\b\w+\b/g);
      const wordCount = words ? words.length : 0;

      playerScores[currentPlayer].words.push(wordCount);
      playerScores[currentPlayer].total += wordCount;

      showCardImage(wordCount);

      setTimeout(() => {
        if (currentPlayer === 1) {
          currentPlayer = 2;
        } else {
          currentPlayer = 1;
          currentRound++;
        }

        if (currentRound > maxRounds) {
          displayFinalResult();
          return;
        }

        inputField.value = "";
        inputField.disabled = false;
        inputField.style.backgroundColor = "";
        typingStarted = false;
        timeLeft = 20;
        updateWordCount();
        updatePlayerDisplay();
      }, 1000);
    } else {
      timerDisplay.textContent = `Timer: ${timeLeft}s`;
    }
  }, 1000);
}

inputField.addEventListener("input", () => {
  updateWordCount();

  if (!typingStarted) {
    typingStarted = true;
    startCountdown();
  }
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timeLeft = 20;
  typingStarted = false;
  currentPlayer = 1;
  currentRound = 1;

  inputField.value = "";
  inputField.disabled = false;
  inputField.style.backgroundColor = "";

  timerDisplay.textContent = `Timer: ${timeLeft}s`;
  wordCountDisplay.textContent = "Words: 0";
  result.textContent = "";

  gameArea.style.display = "none";
  playerSetup.style.display = "block";
});

function showCardImage(wordCount) {
  let cardValue = "2";

  if (wordCount >= 30) {
    cardValue = "ACE";
  } else if (wordCount >= 20) {
    cardValue = "KING";
  } else if (wordCount >= 15) {
    cardValue = "QUEEN";
  } else if (wordCount >= 1 && wordCount <= 10) {
    cardValue = wordCount.toString();
  }

  const suits = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"];
  const randomSuit = suits[Math.floor(Math.random() * suits.length)];

  const cardImg = document.createElement("img");
  cardImg.src = `https://deckofcardsapi.com/static/img/${cardValue[0]}${randomSuit[0]}.png`;
  cardImg.alt = `${cardValue} of ${randomSuit}`;
  cardImg.style.width = "200px";
  cardImg.style.marginTop = "10px";

  result.innerHTML = `<h3>${playerScores[currentPlayer].name} typed ${wordCount} word${wordCount === 1 ? '' : 's'} — your card is ${cardValue} of ${randomSuit}!</h3>`;
  result.appendChild(cardImg);
}

function displayFinalResult() {
  inputField.disabled = true;
  resetBtn.disabled = false;

  const p1 = playerScores[1];
  const p2 = playerScores[2];

  let resultText = `${p1.name}: ${p1.total} words\n${p2.name}: ${p2.total} words\n\n`;

  if (p1.total > p2.total) {
    resultText += `${p1.name} wins! 🏆`;
  } else if (p2.total > p1.total) {
    resultText += `${p2.name} wins! 🏆`;
  } else {
    resultText += `It's a tie! ⚔️`;
  }

  result.innerHTML = `<h2>${resultText.replace(/\n/g, "<br>")}</h2>`;
}
