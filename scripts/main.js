"use strict";

(function initGame() {
  var balls = document.querySelectorAll(".ball");
  var slots = document.querySelectorAll(".slot");
  var colorSlots = document.querySelectorAll(".color-slot");
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
  var ball;
  var ballsPosition;
  var ballTargetIndex;
  var ballTarget;
  var ballParent;
  var isMoved = false;

  function elementTranslation(element) {
    var game = document.querySelector('.game');
    var style = window.getComputedStyle(game);
    var matrix = new WebKitCSSMatrix(style.webkitTransform);
    return matrix.m41;
  }

  function exactPosition(element) {
    var Xposition = 0;
    var Yposition = 0;
    var translation = elementTranslation();

    while (element) {
      if (element.tagName == "body") {
        var xScroll = element.scrollLeft || document.documentElement.scrollLeft;
        var yScroll = element.scrollTop || document.documentElement.scrollTop;
        Xposition += element.offsetLeft - xScroll + element.clientLeft;
        Yposition += element.offsetTop - yScroll + element.clientTop;
      } else {
        // for all non-body elements
        Xposition += element.offsetLeft - element.scrollLeft + element.clientLeft;
        Yposition += element.offsetTop - element.scrollTop + element.clientTop;
      }

      element = element.offsetParent;
    }

    return {
      x: Xposition + translation,
      y: Yposition //+ translation.y

    };
  }

  function getSlotPosition(slots) {
    var slotsPosition = [];
    slots.forEach(function (slot) {
      var coordinates = Object.assign({}, {
        left: exactPosition(slot).x,
        right: exactPosition(slot).x + slot.offsetWidth,
        top: exactPosition(slot).y,
        bottom: exactPosition(slot).y + slot.offsetHeight
      });
      slotsPosition.push(coordinates);
    });
    return slotsPosition;
  }

  function getTarget(slots, event) {
    var slotTargetIndex;
    slots.forEach(function (slot, index) {
      if (event.pageX > slot.left && event.pageX < slot.right && event.pageY > slot.top && event.pageY < slot.bottom) {
        slotTargetIndex = index;
      }
    });

    if (slotTargetIndex === undefined) {
      slotTargetIndex = -1;
    }

    return slotTargetIndex;
  }

  function moveBall(element, event) {
    var parentPosition = exactPosition(element);
    var positionY = event.clientY - parentPosition.y - element.offsetHeight / 2;
    var positionX = event.clientX - parentPosition.x - element.offsetWidth / 2;
    element.style.transform = "translate(".concat(positionX, "px, ").concat(positionY, "px)");
    return {
      transformX: positionX,
      transformY: positionY
    };
  }

  function assignBallToSlot(removeElement, newElement, ballParent, slotTarget) {
    removeElement.innerHTML = "";
    if (newElement) ballParent.appendChild(newElement);
    slotTarget.appendChild(ball);
    ball.style.transform = "none";
  }
  /* create new ball */


  function removeNumbers(name) {
    var changedName;
    var rex = name.search(/\d/g);

    if (rex == -1) {
      changedName = name;
    } else {
      changedName = name.slice(0, rex);
    }

    return changedName;
  }

  function findIndex(id) {
    var name = removeNumbers(id);
    var elements = document.querySelectorAll(".".concat(name));
    var index = 0;
    elements.forEach(function (element) {
      var match = element.id.match(/\d/g);

      if (match !== null) {
        match = parseInt(match[0], 10);

        if (match > index) {
          index = match;
        } else {
          return;
        }

        ;
      }

      ;
    });
    return index + 1;
  }

  function createElement(className, idName) {
    var element = document.createElement('div');
    var index = findIndex(idName);
    idName = removeNumbers(idName);
    element.className = className;
    element.id = "".concat(idName).concat(index);
    element.setAttribute('data-color', idName);
    if (!isMobile) element.addEventListener("mousedown", startMovingBall);
    return element;
  } // desktop move ball


  function startMovingBall(event) {
    ball = event.target;
    isMoved = true;
  }

  function keepMovingBall(event) {
    if (isMoved) {
      moveBall(ball, event);
    }
  }

  function finishMovingBall(event) {
    var colorSlotsPosition = getSlotPosition(colorSlots);
    var colorSlotTargetIndex = getTarget(colorSlotsPosition, event);
    var slotsPosition = getSlotPosition(slots);
    var slotTargetIndex = getTarget(slotsPosition, event);
    var slotTarget = slots[slotTargetIndex];
    var ballParent;
    if (ball) ballParent = ball.parentNode; // remove slot

    if (colorSlotTargetIndex > -1) {
      var colorSlot = colorSlots[colorSlotTargetIndex].firstElementChild.getAttribute("data-color");
      var ballSlot = ballParent.firstElementChild.getAttribute("data-color");

      if (colorSlot === ballSlot && ballParent.matches(".slot")) {
        ball.remove();
      }
    }
    /* assign ball */


    if (slotTargetIndex > -1) {
      // if slot is taken
      if (slotTarget.childElementCount === 1) {
        var slotTargetParent = slots[slotTargetIndex].parentNode;
        var newElement = createElement(ball.className, ball.id); // ball placed in the same room

        if (ballParent.matches(".slot") && ball.parentNode == slotTarget) {
          ball.style.transform = "none"; // replace ball from slot to empty slot
        } else if (ballParent.matches(".slot")) {
          assignBallToSlot(ballParent, slotTarget.lastChild, ballParent, slotTarget); // replace ball from placeholder to taken slot
        } else if (ballParent.matches(".color-slot")) {
          assignBallToSlot(slotTarget, newElement, ballParent, slotTarget);
        }
      } else {
        // replace ball from slot to empty slot
        if (ballParent.matches(".slot")) {
          assignBallToSlot(ballParent, null, ballParent, slotTarget);
        } // replace ball from placeholder to empty slot
        else {
            var _newElement = createElement(ball.className, ball.id);

            assignBallToSlot(slotTarget, _newElement, ballParent, slotTarget);
          }
      }
    } else if (ball) {
      ball.style.transform = 'none';
    }

    isMoved = false;
    lastTargetSlot = null;
    ball = null;
  } // mobile move ball


  function touchingBall(event) {
    if (isMoved) {
      var _slots = document.querySelectorAll(".slot");

      var _colorSlots = document.querySelectorAll(".color-slot");

      var colorSlotsPosition = getSlotPosition(_colorSlots);
      var colorSlotTargetIndex = getTarget(colorSlotsPosition, event);
      var colorSlotTarget = _colorSlots[colorSlotTargetIndex];
      var slotsPosition = getSlotPosition(_slots);
      var slotTargetIndex = getTarget(slotsPosition, event);
      var slotTarget = _slots[slotTargetIndex];
      var slotTargetParent;
      slotTargetParent = slotTarget ? slotTarget.parentNode : null;
      ballTarget.classList.remove('ball--target');

      if (slotTarget || colorSlotTarget) {
        if (colorSlotTarget) {
          // uncklick ball
          if (ballTarget === event.target) {
            isMoved = false; // remove ball from slot
          } else if (colorSlotTarget.firstElementChild.getAttribute("data-color") === ballTarget.getAttribute("data-color")) {
            ballParent.innerHTML = "";
            isMoved = false; // change chosen ball
          } else if (ballTarget.parentNode.matches(".color-slot") === colorSlotTarget.matches(".color-slot")) {
            ballTarget = event.target;
            ballParent = event.target.parentNode;
            ballTarget.classList.add('ball--target');
          } else {
            isMoved = false;
          }
        } else if (ballTarget.parentNode.matches('.slot')) {
          // replace ball from slot to taken slot
          if (slotTarget && slotTarget.childElementCount) {
            assignBallToSlot(ballParent, slotTarget.lastChild, ballParent, slotTarget);
            isMoved = false; // replace ball from slot to empty slot
          } else if (slotTarget && !slotTarget.childElementCount) {
            assignBallToSlot(ballParent, null, ballParent, slotTarget);
            isMoved = false;
          } // replace ball from slot to placeholder

        } else if (ballTarget.parentNode.matches('.color-slot')) {
          var newElement = createElement(ballTarget.className, ballTarget.id); // replace ball from placeholder to taken slot

          if (slotTarget && slotTarget.childElementCount) {
            ballParent.innerHTML = "";
            ballParent.appendChild(newElement);
            slotTarget.innerHTML = "";
            slotTarget.appendChild(ballTarget);
            isMoved = false; // replace ball from placeholder to empty slot
          } else if (slotTarget) {
            ballParent.innerHTML = "";
            ballParent.appendChild(newElement);
            slotTarget.appendChild(ballTarget);
            isMoved = false;
          }
        } // click outside of picking zone

      } else {
        isMoved = false;
      }
    } else {
      if (event.target.matches(".ball") || event.target.matches(".ball") && isColorChanged) {
        var _balls = document.querySelectorAll(".ball");

        ball = event.target;
        ballsPosition = getSlotPosition(_balls);
        ballTargetIndex = getTarget(ballsPosition, event);
        ballTarget = _balls[ballTargetIndex];
        ballParent = ballTarget.parentNode;
        ballTarget.classList.add('ball--target');
        isMoved = true;
      }
    }
  }

  ;

  if (isMobile) {
    document.addEventListener("touchstart", touchingBall);
  } else {
    balls.forEach(function (ball) {
      return ball.addEventListener("mousedown", startMovingBall);
    });
    document.addEventListener("mousemove", keepMovingBall);
    document.addEventListener("mouseup", finishMovingBall);
  }
})();

(function initPlay() {
  // generate colors
  var submitButton = document.getElementById('submit');
  var newGame = document.getElementById('new-game');
  var confettiBox = document.querySelector('.confetti');
  var computer = createGame(convertToColor, generateRandomNumber);
  var player = [];
  var helper = [];
  var lineWidth = 24;
  var config = {
    angle: "90",
    spread: 250,
    // 360
    startVelocity: 40,
    // 60
    elementCount: 200,
    // 150
    //dragFriction: 0.09, // 0.82
    decay: 0.9,
    duration: 4000,
    delay: 0,
    width: "9px",
    height: "9px",
    colors: ['#E68F17', '#FAB005', '#FA5252', '#E64980', '#BE4BDB', '#0B7285', '#15AABF', '#EE1233', '#40C057']
  };
  console.log("computer's order:");
  console.log(computer);

  function generateRandomNumber() {
    return Math.floor(Math.random() * 100);
  }

  function convertToColor(randomNumber) {
    var number = randomNumber();
    var color;

    switch (true) {
      case number <= 17:
        color = 'orange';
        break;

      case number > 17 && number <= 33:
        color = 'yellow';
        break;

      case number > 33 && number <= 50:
        color = 'green';
        break;

      case number > 50 && number <= 67:
        color = 'blue';
        break;

      case number > 67 && number <= 83:
        color = 'red';
        break;

      case number > 83 && number <= 100:
        color = 'purple';
        break;

      default:
        break;
    }

    return color;
  }

  function createGame(toColor, number) {
    var colors = [];
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
    }

    ;
    return colors;
  } // check submit


  function checkMatches(player, computerArray) {
    var allColors = ['orange', 'yellow', 'green', 'blue', 'red', 'purple'];
    var helper = [];
    allColors.forEach(function (color) {
      if (computer.includes(color)) {
        var playerIndexes = [];
        var computerIndexes = [];
        player.map(function (p, index) {
          p === color ? playerIndexes.push(index) : false;
        });
        computer.map(function (c, index) {
          c === color ? computerIndexes.push(index) : false;
        });
        computerIndexes.forEach(function (index) {
          if (playerIndexes.includes(index)) {
            helper.push('black');
          } else if (playerIndexes.length >= computerIndexes.length && !playerIndexes.every(function (index) {
            return computerIndexes.includes(index);
          })) {
            helper.push('gray');
          } else if (computerIndexes.length > playerIndexes.length && computerIndexes.length >= 1) {
            return;
          }
        });
        playerIndexes.forEach(function (index) {
          if (computerIndexes.length > playerIndexes.length && computerIndexes.length >= 1) {
            if (computerIndexes.includes(index)) return;
            helper.push('gray');
          } else {
            return;
          }
        });
      }
    });
    return helper;
  }

  helper = checkMatches(player, computer);

  function createRound(colors, helpers) {
    var wrapper = document.querySelector('.rounds');
    var round = document.createElement('div');
    var guesses = document.createElement('div');
    var ratings = document.createElement('div');
    round.className = 'round';
    guesses.className = 'guesses';
    ratings.className = 'ratings';
    wrapper.appendChild(round);
    round.appendChild(guesses);
    round.appendChild(ratings);
    colors.forEach(function (color) {
      var quess = document.createElement('div');
      quess.className = "guess-ball ".concat(color);
      guesses.appendChild(quess);
    });
    helpers.forEach(function (rating) {
      var helper = document.createElement('div');
      helper.className = "helper ".concat(rating, "-helper");
      ratings.appendChild(helper);
    });
  }

  function gameOver(result) {
    var results = document.querySelector('.results');
    var picking = document.querySelector('.pick-colors');
    var computerColors = results.querySelector('.computer');
    var statement = results.querySelector('.statement');
    statement.textContent = result == 'won' ? 'You won!' : 'You lost!';
    computer.map(function (color) {
      var ball = document.createElement('div');
      ball.className = "guess-ball ".concat(color);
      computerColors.appendChild(ball);
    });
    results.style.setProperty('visibility', 'visible');
    picking.classList.add('gameover');
    results.classList.add('gameover');
  }

  function resetPreviousGame() {
    var picking = document.querySelector('.pick-colors');
    var rounds = document.querySelector('.rounds');
    var line = document.querySelector('.line');
    var results = document.querySelector('.results');
    var statement = results.querySelector('.statement');
    var computerColors = results.querySelector('.computer');
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

  submitButton.addEventListener('click', function (event) {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
    var roundColors = document.querySelectorAll('.check .ball');
    var labels = document.querySelector('.labels');
    var wrapper = document.querySelector('.rounds');
    var line = document.querySelector('.line');
    var increaseWidth = isMobile ? 40 : 48;
    if (roundColors.length < 4) return;
    roundColors.forEach(function (color) {
      return player.push(color.dataset.color);
    });
    helper = checkMatches(player, computer);
    helper.sort();
    createRound(player, helper);
    lineWidth += increaseWidth;
    line.style.width = lineWidth + 'px';

    if (player.toString() === computer.toString()) {
      gameOver('won');
      confetti(confettiBox, config);
    } else if (wrapper.childElementCount >= 7) {
      gameOver('lost');
    } else {
      player = [];
    }

    roundColors.forEach(function (element) {
      return element.parentNode.removeChild(element);
    });
  }, false);
  newGame.addEventListener('click', function () {
    resetPreviousGame();
  }, false);
})();

(function initApp() {
  var body = document.getElementsByTagName('body')[0];
  var navButton = document.querySelector('.nav-button');
  var navButtonText = navButton.querySelector('.nav-button--text');
  var header = document.querySelector('.header');
  var game = document.querySelector('.game');
  var example = document.querySelector('.example');
  var placeholder = document.querySelector('colors');
  var playButton = document.querySelector('.play-button'); // const overlay = document.querySelector('.overlay');

  var confetti = document.querySelector('.confetti');

  function hideRules() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
    var isDisplayed = navButtonText.textContent == 'close' ? 'open' : 'close';

    if (isMobile) {
      body.classList.toggle('body--is-mobile');
      navButton.classList.toggle('nav--is-mobile');
      navButtonText.textContent = "";
    } else {
      navButtonText.textContent = isDisplayed;
    }

    navButton.classList.toggle('opened');
    header.classList.toggle('hidden');
    game.classList.toggle('game-hidden');
    confetti.classList.toggle('confetti--hidden'); // game.style.transform = navButtonText.textContent == 'close' ?
    // 'none'
    // :
    // 'translateX(calc((550px + (((100vw - 550px - 370px)/3)*2) - ((100vw / 2) - (370px / 2))) * -1))';
    // if example is visible

    if (example.clientHeight > 0) {
      example.classList.add('example-hidden');
      localStorage.setItem('example', 'hidden');
    } // if (isDisplayed === 'open') {


    if (navButton.classList.contains("opened")) {
      localStorage.setItem('display', 'none');
    } else {
      localStorage.removeItem('display');
    }
  }

  function handleLocalStorage() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;

    if (!localStorage.getItem('display') && isMobile) {
      navButtonText.textContent = "";
    } else if (localStorage.getItem('display') === 'none') {
      if (isMobile) {
        body.classList.add('body--is-mobile');
        navButton.classList.add('nav--is-mobile');
        navButtonText.textContent = "";
      } else {
        navButtonText.textContent = "open";
      }

      navButton.classList.add('opened');
      header.classList.add('hidden');
      game.classList.add('game-hidden');
      confetti.classList.add('confetti--hidden');
      example.style.setProperty('display', 'none'); // window.setTimeout(example.style.setProperty('display', 'none'), 300);
      // game.addEventListener('transitionend', function() {
      //   overlay.style.setProperty('display', 'none');
      // }, false);
    } else if (localStorage.getItem('example') === 'hidden') {
      playButton.classList.add('example-hidden');
      example.style.setProperty('display', 'none'); // overlay.style.setProperty('display', 'none');
      // } else if (localStorage.getItem('display') !== 'none') {
      //   overlay.style.setProperty('display', 'none');
    }
  } // hidden information


  navButton.addEventListener('click', function () {
    hideRules();
  }, false); // play a game

  playButton.addEventListener('click', function () {
    playButton.classList.add('example-hidden');
    hideRules();
    localStorage.setItem('example', 'hidden');
  }, false);
  handleLocalStorage();
})();