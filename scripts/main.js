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
    var offsetX = isMobile ? event.targetTouches[0].pageX : event.pageX;
    var offsetY = isMobile ? event.targetTouches[0].pageY : event.pageY;
    slots.forEach(function (slot, index) {
      if (offsetX > slot.left && offsetX < slot.right && offsetY > slot.top && offsetY < slot.bottom) {
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
        if (ball && ballParent.matches(".slot")) {
          assignBallToSlot(ballParent, null, ballParent, slotTarget);
        } // replace ball from placeholder to empty slot
        else if (ball) {
            var _newElement = createElement(ball.className, ball.id);

            assignBallToSlot(slotTarget, _newElement, ballParent, slotTarget);
          }
      }
    } else if (ball) {
      ball.style.transform = 'none';
    }

    isMoved = false;
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
      if (event.target.matches(".ball")) {
        // new list of balls
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
  var playButton = document.getElementById('play-game');
  var newGame = document.getElementById('new-game');
  var confettiBox = document.querySelector('.confetti');
  var computer = createGame(convertToColor, generateRandomNumber);
  var player = [];
  var helper = checkMatches(player, computer);
  var lineWidth = 24;
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;
  var colors = ["#E68F17", "#FAB005", "#FA5252", "#0B7285", "#15AABF", "#EE1233", "#40C057"];
  var desktopConfetti = {
    angle: "90",
    spread: 250,
    startVelocity: 40,
    elementCount: 200,
    decay: 0.9,
    duration: 4000,
    delay: 0,
    width: "9px",
    height: "9px",
    colors: colors
  };
  var mobileConfetti = {
    angle: "90",
    spread: 200,
    startVelocity: 50,
    elementCount: 200,
    decay: 0.9,
    duration: 4000,
    delay: 0,
    width: "9px",
    height: "9px",
    colors: colors
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

  function createRound(colors, helpers) {
    var wrapper = document.getElementById('rounds');
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

  function submitCheck(event) {
    var roundColors = document.querySelectorAll('.checking .ball'); // const labels = document.querySelector('.labels');

    var wrapper = document.getElementById('rounds');
    var line = document.getElementById('line');
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
      var config = isMobile ? mobileConfetti : desktopConfetti;
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
  }

  function gameOver(result) {
    var results = document.getElementById('results');
    var picking = document.getElementById('pick-colors');
    var computerColors = document.getElementById('computer');
    var statement = document.getElementById('statement');
    statement.textContent = result == 'won' ? 'You won!' : 'You lost!';
    computer.map(function (color) {
      var ball = document.createElement('div');
      ball.className = "guess-ball ".concat(color);
      computerColors.appendChild(ball);
    });
    results.style.setProperty('visibility', 'visible');
    picking.classList.add('picking--gameover');
    results.classList.add('results--gameover');
  }

  function resetPreviousGame() {
    var picking = document.getElementById('pick-colors');
    var slots = document.querySelectorAll('.slot');
    var rounds = document.getElementById('rounds');
    var line = document.getElementById('line');
    var results = document.getElementById('results');
    var statement = document.getElementById('statement');
    var computerColors = document.getElementById('computer');
    rounds.innerHTML = "";
    statement.innerHTML = "";
    computerColors.innerHTML = "";
    line.style.width = 0;
    lineWidth = 24;
    slots.forEach(function (slot) {
      return slot.innerHTML = "";
    });
    results.style.setProperty('visibility', 'hidden');
    picking.classList.remove('picking--gameover');
    results.classList.remove('results--gameover');
    computer = createGame(convertToColor, generateRandomNumber);
    console.log("computer's order:");
    console.log(computer);
    player = [];
    helper = checkMatches(player, computer);
  }

  submitButton.addEventListener('click', submitCheck);
  newGame.addEventListener('click', resetPreviousGame);
  playButton.addEventListener('click', resetPreviousGame);
})();

(function initApp() {
  var navigation = document.getElementById('navigation');
  var navigationText = navigation.querySelector('.nav__button-text');
  var header = document.querySelector('.header');
  var game = document.querySelector('.game');
  var example = document.querySelector('.example');
  var playButton = document.getElementById('play-game');
  var overlay = document.querySelector('.overlay');
  var confetti = document.querySelector('.confetti');
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? true : false;

  function hideRules() {
    if (isMobile) {
      document.body.classList.toggle('body--is-mobile');
      navigationText.textContent = "";
      navigation.classList.toggle('opened');
      confetti.classList.toggle('confetti--hidden');

      if (navigation.classList.contains("opened")) {
        document.body.classList.add('header--hidden');
        document.body.classList.remove('header--visible');
        window.setTimeout(function () {
          header.style.display = "none";
        }, 300);
      } else {
        header.style.display = "flex";
        window.setTimeout(function () {
          document.body.classList.remove('header--hidden');
          document.body.classList.add('header--visible');
        }, 100);
      }
    } else {
      var isDisplayed = navigationText.textContent == 'close' ? 'open' : 'close';
      navigationText.textContent = isDisplayed;
      navigation.classList.toggle('opened');
      document.body.classList.toggle('header--hidden');
      confetti.classList.toggle('confetti--hidden');
    } // if example is visible


    if (example.clientHeight > 0) {
      document.body.classList.add('example--hidden');
      localStorage.setItem('display-example', 'hidden');
      localStorage.setItem('display-rules', 'none');
    } // if header is visible


    if (navigation.classList.contains("opened")) {
      localStorage.setItem('display-rules', 'none');
    } else {
      localStorage.removeItem('display-rules');
    }
  }

  function handleLocalStorage() {
    // mobile
    if (isMobile) {
      if (localStorage.getItem('display-rules') === "none") {
        document.body.classList.add('body--is-mobile');
        document.body.classList.add('example--hidden');
        document.body.classList.add('header--hidden');
        navigation.classList.add('opened');
        navigationText.textContent = "";
        confetti.classList.add('confetti--hidden');
        overlay.classList.add('overlay--hidden');
        header.style.display = "none";
      } else {
        navigation.classList.add('nav--hidden');
        navigationText.textContent = "";
        overlay.classList.add('overlay--hidden');

        if (localStorage.getItem('display-example') === "hidden") {
          document.body.classList.add('example--hidden');
        }
      }
    } // desktop
    else {
        if (localStorage.getItem('display-rules') === "none") {
          navigationText.textContent = "open";
          navigation.classList.add('opened');
          document.body.classList.add('header--hidden');
          document.body.classList.add('example--hidden');
          confetti.classList.add('confetti--hidden');
          window.setTimeout(function () {
            overlay.classList.add('overlay--hidden');
          }, 700);
        } else {
          navigationText.textContent = "close";
          navigation.classList.remove('opened');
          overlay.classList.add('overlay--hidden');

          if (localStorage.getItem('display-example')) {
            document.body.classList.add('example--hidden');
          }
        }
      }
  } // hidden information


  navigation.addEventListener('click', function () {
    hideRules();
  }); // play a game

  playButton.addEventListener('click', function () {
    hideRules();
    localStorage.setItem('display-example', 'hidden');
  });
  handleLocalStorage();
})();