'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(acc, sort = false) {
  containerMovements.innerHTML = '';

  const copiedMovs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  copiedMovs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const updateUI = function(acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcAndDisplayBalance(acc);

  // Display summery
  calcAndDisplaySummery(acc);
}

const calcAndDisplayBalance = function(a) {
  a.balance = a.movements.reduce((acc, m) => acc + m, 0);
  labelBalance.textContent = `${a.balance.toFixed(2)}€`;
};

const calcAndDisplaySummery = function(a) {
  const incomes = a.movements
    .filter(m => m > 0)
    .reduce((acc, x) => acc + x, 0);

  const outcomes = a.movements
    .filter(m => m < 0)
    .reduce((acc, x) => acc + x, 0);

    const interest = a.movements
    .filter(m => m > 0)
    .map(d => d * a.interestRate/100)
    .filter(i => i >= 1)
    .reduce((acc, x) => acc + x, 0);
  
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const generateUsernames = function (accs) {
  accs.forEach(function (a) {
    a.username = a.owner
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  })
};
generateUsernames(accounts);

// Event handler
let currentAccount;

// Logging-in
btnLogin.addEventListener('click', function(e) {
  //Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(a => a.username === inputLoginUsername.value);

  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}!`;

    containerApp.style.opacity = 100;
  	    
    //Generate current date
  	const now = new Date();
  	const day = `${now.getDate()}`.padStart(2, 0);
  	const month = `${now.getMonth() + 1}`.padStart(2, 0);
  	const year = now.getFullYear();
  	const hour = `${now.getHours()}`.padStart(2, 0);
  	const mins = `${now.getMinutes()}`.padStart(2, 0);
  	labelDate.textContent = `${day}/${month}/${year}, ${hour}:${mins}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  } else {
    alert('Wrong username or password. Please try again...')
  }
});

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// Transfer money to..
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Math.floor(inputTransferAmount.value);
  const receiver = accounts
    .find(a => a.username === inputTransferTo.value);

  if(amount > 0 && currentAccount.balance >= amount &&
     receiver !== undefined && 
     receiver.username !== currentAccount.username){
      // Doing tranfer
      currentAccount.movements.push(-amount);
      receiver.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiver.movementsDates.push(new Date().toISOString());

      updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

// Loan request
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if(amount > 0 &&
     currentAccount.movements.some(m => m >= amount * 0.1)){

      // Add the loan
      currentAccount.movements.push(amount);

      // Add Loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
     }

    inputLoanAmount.value = '';
});

// Close account
btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if(currentAccount.username === inputCloseUsername.value &&
     currentAccount.pin === Number(inputClosePin.value)){
       const index = accounts.findIndex(a => a.username === currentAccount.username);

       // Delete account
       accounts.splice(index, 1);

       // Hide UI
       containerApp.style.opacity = 0;
  }

  labelWelcome.textContent = `We hope to see you again, ${currentAccount.owner.split(' ')[0]}!`;
});

let sortState = false;

btnSort.addEventListener('click', function(e) {
  e.preventDefault();

  displayMovements(currentAccount, !sortState);

  // Set the sorted state to the opposite
  sortState = !sortState;
})