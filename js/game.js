(function initPlay(){
  // generate colors
  const submitButton = document.getElementById('submit');
  const newGame = document.getElementById('new-game');
  const confettiBox = document.querySelector('.confetti');
  let computer = createGame(convertToColor, generateRandomNumber);
  let player = [];
  let helper = [];
  let lineWidth = 24;

  const config = {
    angle: "90",
    spread: 250,  // 360
    startVelocity: 40,  // 60
    elementCount: 200,  // 150
    //dragFriction: 0.09, // 0.82
    decay: 0.9,
    duration: 4000,
    delay: 0,
    width: "9px",
    height: "9px",
    colors: [
    '#E68F17',
    '#FAB005',
    '#FA5252',
    '#E64980',
    '#BE4BDB',
    '#0B7285',
    '#15AABF',
    '#EE1233',
    '#40C057'
  ]
  };

  console.log("computer's order:");
  console.log(computer);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100);
  }

  function convertToColor(randomNumber) {
    let number = randomNumber();
    let color;

    switch (true) {
      case (number <= 17):
        color = 'orange';
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
        color = 'purple';
        break;
      default:
        break;
    }

    return color;
  }

  function createGame(toColor, number) {
    let colors = [];

    /*  only single colors
    while (colors.length < 4) {
      let color = toColor(number);
      console.log(color);
      if (colors.length >= 1 && colors.includes(color)) {
        colors.push();
      } else {
        colors.push(color);
      }
    }
    */


    while (colors.length < 4) {
      colors.push(toColor(number));
    };

    return colors;
  }



  // check submit

  function checkMatches(player, computerArray) {
    let allColors = ['orange', 'yellow', 'green', 'blue', 'red', 'purple'];
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

          } else if (playerIndexes.length >= computerIndexes.length &&
                    !playerIndexes.every(index => computerIndexes.includes(index))) {
            helper.push('gray')

          } else if (computerIndexes.length > playerIndexes.length &&
                     computerIndexes.length >= 1) {
           return
          }
        });

        playerIndexes.forEach(index => {
          if (computerIndexes.length > playerIndexes.length &&
              computerIndexes.length >= 1) {
            if (computerIndexes.includes(index)) return;
            helper.push('gray');

          } else {
            return
          }
        })
      }
    })

    return helper;
  }


  helper = checkMatches(player, computer);

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

  function gameOver(result) {
    const results = document.querySelector('.results');
    const picking = document.querySelector('.pick-colors');
    const computerColors = results.querySelector('.computer');
    const statement = results.querySelector('.statement');

    statement.textContent = result == 'won' ? 'You won!' : 'You lost!';

    computer.map(color => {
      let ball = document.createElement('div');
      ball.className = `guess-ball ${color}`;
      computerColors.appendChild(ball);
    });

    results.style.setProperty('visibility', 'visible');
    picking.classList.add('gameover');
    results.classList.add('gameover');
  }

  function resetPreviousGame() {
    const picking = document.querySelector('.pick-colors');
    const rounds = document.querySelector('.rounds');
    const line = document.querySelector('.line');
    const results = document.querySelector('.results');
    const statement = results.querySelector('.statement');
    const computerColors = results.querySelector('.computer');

    rounds.innerHTML = "";
    statement.innerHTML = "";
    computerColors.innerHTML = "";
    line.style.width = 0;
    lineWidth = 24;

    results.style.setProperty('visibility', 'hidden');
    picking.classList.remove('gameover');
    results.classList.remove('gameover');

    computer = createGame(convertToColor, generateRandomNumber);

    console.log("computer's order:");
    console.log(computer);
    player = [];
    helper = checkMatches(player, computer);
  }


  submitButton.addEventListener('click', function(event) {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? true : false;

    const roundColors = document.querySelectorAll('.check .ball');
    const labels = document.querySelector('.labels');
    let wrapper = document.querySelector('.rounds');
    const line = document.querySelector('.line');
    let increaseWidth = isMobile ? 40 : 48;

    if (roundColors.length < 4) return;

    roundColors.forEach(color => player.push(color.dataset.color));
    helper = checkMatches(player, computer);
    helper.sort();

    createRound(player, helper);

    lineWidth += increaseWidth;
    line.style.width =  lineWidth + 'px';

    if (player.toString() === computer.toString()) {
      gameOver('won');
      confetti(confettiBox, config);

    } else if (wrapper.childElementCount >= 7) {
      gameOver('lost');

    } else {
      player = [];
    }

    roundColors.forEach(element => element.parentNode.removeChild(element));

  }, false);

  newGame.addEventListener('click', function() {
    resetPreviousGame();
  }, false);
}());
