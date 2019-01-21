// generate colors
const submitButton = document.getElementById('submit');
let player = [];
let helper = [];
let computer = createGame(convertToColor, generateRandomNumber);

function generateRandomNumber() {
  return Math.floor(Math.random() * 100);
}

function convertToColor(randomNumber) {
  let number = randomNumber();
  let color;

  switch (true) {
    case (number <= 17):
      color = 'white';
      break;
    case (number > 17 && number <= 33):
      color = 'yellow';
      break;
    case (number > 33 && number <= 50):
      color = 'green';
      break;
    case (number > 50 && number <= 67):
      color = 'blue';
      break;
    case (number > 67 && number <= 83):
      color = 'red';
      break;
    case (number > 83 && number <= 100):
      color = 'black';
      break;
    default:
      break;
  }

  return color;
}

function createGame(toColor, number) {
  let colors = [];

  while (colors.length < 4) {
    colors.push(toColor(number));
  };

  return colors;
}



// check submit

function checkMatches(player, computerArray) {
  let allColors = ['white', 'yellow', 'green', 'blue', 'red', 'black'];
  let helper = [];

  allColors.forEach(color => {
    if (computer.includes(color)) {
      let playerIndexes = [];
      let computerIndexes = [];

      player.map((p, index) => {
        (p === color) ? playerIndexes.push(index) : false
      });

      computer.map((c, index) => {
        (c === color) ? computerIndexes.push(index) : false
      });

      computerIndexes.forEach(index => {

        if (playerIndexes.includes(index)) {
            helper.push('black')

        } else if (playerIndexes.length >= computerIndexes.length) {
          helper.push('gray')
        }
      });
    }
  })

  return helper;
}


helper = checkMatches(player, computer);
console.log(helper);



function createRound(colors, helpers) {
  let wrapper = document.querySelector('.rounds');

  let round = document.createElement('div');
  let guesses = document.createElement('div');
  let ratings = document.createElement('div');

  round.className = 'round';
  guesses.className = 'guesses';
  ratings.className = 'ratings';

  wrapper.appendChild(round);
  round.appendChild(guesses);
  round.appendChild(ratings);

  colors.forEach(color => {
    let quess = document.createElement('div');
    quess.className = `guess-ball ${color}`;
    guesses.appendChild(quess)
  });

  helpers.forEach(rating => {
    let helper = document.createElement('div');
    helper.className = `helper ${rating}-helper`;
    ratings.appendChild(helper)
  });
}


submitButton.addEventListener('click', function(event) {
  const roundColors = document.querySelectorAll('.check .ball');
  const labels = document.querySelector('.labels');
  let wrapper = document.querySelector('.rounds');
  const line = document.querySelector('.line');

  if (window.getComputedStyle(labels).getPropertyValue('opacity') == 0) {
    labels.style.setProperty('opacity', 1);
    labels.style.setProperty('transform', 'none');
  };

  roundColors.forEach(color => player.push(color.dataset.color));
  helper = checkMatches(player, computer);
  helper.sort();

  createRound(player, helper);

  roundColors.forEach(element => element.parentNode.removeChild(element));

}, false);
