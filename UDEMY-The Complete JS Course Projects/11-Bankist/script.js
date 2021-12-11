'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';

  const copiedMovs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  copiedMovs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const updateUI = function(acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcAndDisplayBalance(acc);

  // Display summery
  calcAndDisplaySummery(acc);
}

const calcAndDisplayBalance = function(a) {
  a.balance = a.movements.reduce((acc, m) => acc + m, 0);
  labelBalance.textContent = `${a.balance}€`;
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
  
  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;
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

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();

    updateUI(currentAccount);
  } else {
    alert('Wrong username or password. Please try again...')
  }
});

// Transfer money to..
btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiver = accounts
    .find(a => a.username === inputTransferTo.value);

  if(amount > 0 && currentAccount.balance >= amount &&
     receiver !== undefined && 
     receiver.username !== currentAccount.username){
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    updateUI(currentAccount);
  }
  inputTransferAmount.value = inputTransferTo.value = '';
});

// Loan request
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 &&
     currentAccount.movements.some(m => m >= amount * 0.1)){

      // Add the loan
      currentAccount.movements.push(amount);

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

  displayMovements(currentAccount.movements, !sortState);

  // Set the sorted state to the opposite
  sortState = !sortState;
})