'use strict';

//Selecting elements
const player0 = document.querySelector('.player--0');
const player1 = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const currentScore0El = document.getElementById('current--0');
const currentScore1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

//Setting starting conditions
let scores, playing, currentScore, activePlayer;

const initConditions = () => {
  currentScore = 0;
  activePlayer = 0;
  scores = [0, 0];
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  currentScore0El.textContent = 0;
  currentScore1El.textContent = 0;
  diceEl.classList.add('hidden');
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove('player--winner');
  player0.classList.add('player--active');
  player1.classList.remove('player--active');
};

initConditions();

const setCurrentScore = function () {
  document.getElementById(`current--${activePlayer}`).textContent =
    currentScore;
};

const switchPlayer = () => {
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

//Rolling dice functionallity
btnRoll.addEventListener('click', function () {
  if (playing) {
    //1.Generating a random dice roll
    const diceRoll = Math.trunc(Math.random() * 6) + 1;
    //2. Display dice
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${diceRoll}.png`;
    //3.Check for rolled One : if true => switch to next player
    if (diceRoll === 1) {
      currentScore = 0;
      setCurrentScore();
      switchPlayer();
    } else {
      currentScore += diceRoll;
      setCurrentScore();
    }
  }
});

//Holding the score functionallity
btnHold.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    currentScore = 0;
    setCurrentScore();
    if (scores[activePlayer] >= 100) {
      //current player wins
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('.player--active');
      diceEl.classList.add('hidden');
    } else {
      switchPlayer();
    }
  }
});

//Starting new game
btnNew.addEventListener('click', initConditions);
