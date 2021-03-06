(function initPlay(){
  // generate colors
  const submitButton = document.getElementById('submit');
  const playButton = document.getElementById('play-game');
  const newGame = document.getElementById('new-game');
  const confettiBox = document.querySelector('.confetti');
  let computer = createGame(pickColor);
  let player = [];
  let helper = checkMatches(player, computer);
  let lineWidth = 24;

  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                 ? true : false;

  const colors =  ["#E68F17", "#FAB005", "#FA5252", "#0B7285", "#15AABF", "#EE1233", "#40C057"];

  const desktopConfetti = {
    angle: "90",
    spread: 250,
    startVelocity: 40,
    elementCount: 200,
    decay: 0.9,
    duration: 4000,
    delay: 0,
    width: "9px",
    height: "9px",
    colors
  };

  const mobileConfetti = {
    angle: "90",
    spread: 200,
    startVelocity: 50,
    elementCount: 200,
    decay: 0.9,
    duration: 4000,
    delay: 0,
    width: "9px",
    height: "9px",
    colors
  };

  console.log("computer's order:");
  console.log(computer);

  // function generateRandomNumber() {
  //   return Math.floor(Math.random() * 100);
  // }

  function pickColor() {
    const colors = ["orange", "yellow", "green", "blue", "red", "purple"];
    const index = Math.floor(Math.random() * colors.length);

    return colors[index];
  }

  function createGame(pickColor) {
    let pickedColors = [];

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


    while (pickedColors.length < 4) {
      pickedColors.push(pickColor());
    };

    return pickedColors;
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

  function createRound(colors, helpers) {
    let wrapper = document.getElementById('rounds');

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

  function submitCheck(event) {
    const roundColors = document.querySelectorAll('.checking .ball');
    // const labels = document.querySelector('.labels');
    let wrapper = document.getElementById('rounds');
    const line = document.getElementById('line');
    let increaseWidth = isMobile ? 40 : 48;

    if (roundColors.length < 4) return;

    roundColors.forEach(color => player.push(color.dataset.color));
    helper = checkMatches(player, computer);
    helper.sort();

    createRound(player, helper);

    lineWidth += increaseWidth;
    line.style.width =  lineWidth + 'px';

    if (player.toString() === computer.toString()) {
      const config = isMobile ? mobileConfetti : desktopConfetti;
      gameOver('won');
      confetti(confettiBox, config);

    } else if (wrapper.childElementCount >= 7) {
      gameOver('lost');

    } else {
      player = [];
    }

    roundColors.forEach(element => element.parentNode.removeChild(element));
  }

  function gameOver(result) {
    const results = document.getElementById('results');
    const picking = document.getElementById('pick-colors');
    const computerColors = document.getElementById('computer');
    const statement = document.getElementById('statement');

    statement.textContent = result == 'won' ? 'You won!' : 'You lost!';

    computer.map(color => {
      let ball = document.createElement('div');
      ball.className = `guess-ball ${color}`;
      computerColors.appendChild(ball);
    });

    results.style.setProperty('visibility', 'visible');
    picking.classList.add('picking--gameover');
    results.classList.add('results--gameover');
  }

  function resetPreviousGame() {
    const picking = document.getElementById('pick-colors');
    const slots = document.querySelectorAll('.slot');
    const rounds = document.getElementById('rounds');
    const line = document.getElementById('line');
    const results = document.getElementById('results');
    const statement = document.getElementById('statement');
    const computerColors = document.getElementById('computer');

    rounds.innerHTML = "";
    statement.innerHTML = "";
    computerColors.innerHTML = "";
    line.style.width = 0;
    lineWidth = 24;

    slots.forEach(slot => slot.innerHTML = "");

    results.style.setProperty('visibility', 'hidden');
    picking.classList.remove('picking--gameover');
    results.classList.remove('results--gameover');

    computer = createGame(pickColor);

    console.log("computer's order:");
    console.log(computer);
    player = [];
    helper = checkMatches(player, computer);
  }


  submitButton.addEventListener('click', submitCheck);
  newGame.addEventListener('click', resetPreviousGame);
  playButton.addEventListener('click', resetPreviousGame);
}());
