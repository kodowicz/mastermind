"use strict";

var lastTargetSlot;
var createChild;
var over;

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
  element.setAttribute('draggable', 'true');
  element.setAttribute('ondragstart', 'return onDragStart(event)');
  element.setAttribute('ondragend', 'return onDragEnd(event)');
  return element;
}

function onDragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData("text", event.target.getAttribute('id'));
  event.dataTransfer.setDragImage(event.target, 30, 30);

  if (event.target.parentNode.matches('.slot') || event.target.parentNode.matches('.color-slot')) {
    lastTargetSlot = event.target.parentNode;
  }

  createChild = event.target;
  return true;
}

function onDrop(event) {
  var data = event.dataTransfer.getData("text");
  var target = event.target;
  var targetParent = target.parentNode; // ball places in the same room

  if (lastTargetSlot === targetParent) {
    targetParent.appendChild(document.getElementById(data));
  } else {
    if (targetParent.className === 'color-slot') {
      // remove ball
      if (removeNumbers(lastTargetSlot.children[0].id) === removeNumbers(target.id)) {
        lastTargetSlot.removeChild(document.getElementById(data));
      } // ball dropped at placeholder
      //else if (lastTargetSlot.className === 'slot') {
      //const newElement = createElement(target.className, target.id);
      //lastTargetSlot.removeChild(createChild);
      //lastTargetSlot.appendChild(newElement);
      //return;
      //}


      return;
    } // replace ball from slot to placeholder


    if (createChild.parentNode.matches('.color-slot')) {
      var newElement = createElement(createChild.className, createChild.id); // replace ball from placeholder to taken slot

      if (target.matches('.ball')) {
        targetParent.removeChild(target);
        targetParent.appendChild(document.getElementById(data));
        lastTargetSlot.appendChild(newElement); // replace ball from placeholder to empty slot
      } else {
        createChild.parentNode.appendChild(newElement);
        target.appendChild(document.getElementById(data));
      }

      return;
    } // replace ball from slot to slot


    if (target.matches('.ball') && createChild.parentNode.parentNode === over.parentNode.parentNode) {
      targetParent.removeChild(target);
      targetParent.appendChild(document.getElementById(data));
      lastTargetSlot.append(target);
      return; // replace ball from slot to empty slot
    } else {
      target.appendChild(document.getElementById(data));
    }
  }

  event.stopPropagation();
  return false;
}

function onDragOver(event) {
  over = event.target;
  event.preventDefault();
}

function onDragEnd(event) {
  lastTargetSlot = null;
} // generate colors


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
      color = 'white';
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
      color = 'black';
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
  var allColors = ['white', 'yellow', 'green', 'blue', 'red', 'black'];
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
  var text = results.querySelector('.text');
  text.textContent = result == 'won' ? 'You won!' : 'You lost!';
  computer.map(function (color) {
    var ball = document.createElement('div');
    ball.className = "guess-ball ".concat(color);
    computerColors.appendChild(ball);
  });
  results.style.setProperty('visibility', 'visible');
  picking.classList.add('gameover');
  results.classList.add('gameover');
}

;

function resetPreviousGame() {
  var picking = document.querySelector('.pick-colors');
  var rounds = document.querySelector('.rounds');
  var line = document.querySelector('.line');
  var results = document.querySelector('.results');
  var text = results.querySelector('.text');
  var computerColors = results.querySelector('.computer');
  rounds.innerHTML = "";
  text.innerHTML = "";
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
  var roundColors = document.querySelectorAll('.check .ball');
  var labels = document.querySelector('.labels');
  var wrapper = document.querySelector('.rounds');
  var line = document.querySelector('.line');
  if (roundColors.length < 4) return;
  roundColors.forEach(function (color) {
    return player.push(color.dataset.color);
  });
  helper = checkMatches(player, computer);
  helper.sort();
  createRound(player, helper);
  lineWidth += 48;
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
var navButton = document.querySelector('.nav-button');
var navButtonText = navButton.querySelector('.nav-button--text');
var header = document.querySelector('.header');
var game = document.querySelector('.game');
var example = document.querySelector('.example');
var placeholder = document.querySelector('colors');
var playButton = document.querySelector('.play-button');
var overlay = document.querySelector('.overlay');

function hideRules() {
  var isDisplayed = navButtonText.textContent == 'close' ? 'open' : 'close';
  navButtonText.textContent = isDisplayed;
  navButton.classList.toggle('opened');
  header.classList.toggle('hidden');
  game.classList.toggle('hidden'); // if example is visible

  if (example.clientHeight > 0) {
    example.classList.add('example-hidden');
    localStorage.setItem('example', 'hidden');
  }

  if (isDisplayed === 'open') {
    localStorage.setItem('display', 'none');
  } else {
    localStorage.removeItem('display');
  }
}

if (localStorage.getItem('display') === 'none') {
  navButtonText.textContent = 'open';
  navButton.classList.add('opened');
  header.classList.add('hidden');
  game.classList.add('hidden');
  example.style.setProperty('display', 'none');
  window.setTimeout(example.style.setProperty('display', 'none'), 300);
  game.addEventListener('transitionend', function () {
    overlay.style.setProperty('display', 'none');
  }, false);
} else if (localStorage.getItem('example') === 'hidden') {
  playButton.classList.add('example-hidden');
  example.style.setProperty('display', 'none');
  overlay.style.setProperty('display', 'none');
} else if (localStorage.getItem('display') !== 'none') {
  overlay.style.setProperty('display', 'none');
} // hidden information


navButton.addEventListener('click', function () {
  hideRules();
}, false); // play a game

playButton.addEventListener('click', function () {
  playButton.classList.add('example-hidden');
  hideRules();
  localStorage.setItem('example', 'hidden');
}, false);