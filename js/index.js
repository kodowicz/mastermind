const navButton = document.querySelector('.nav-button');
const navButtonText = navButton.querySelector('.nav-button--text');
const header = document.querySelector('.header');
const game = document.querySelector('.game');
const example = document.querySelector('.example');
const placeholder = document.querySelector('colors');
const playButton = document.querySelector('.play-button');
const overlay = document.querySelector('.overlay');
let lastTargetSlot;
let createChild;


if (localStorage.getItem('display') === 'none') {
  navButtonText.textContent = 'open';
  navButton.classList.add('opened');
  header.style.setProperty('visibility', 'hidden');
  header.classList.add('hidden');
  game.classList.add('hidden');
  example.style.setProperty('display', 'none');
  window.setTimeout(example.style.setProperty('display', 'none'), 300);


  game.addEventListener('transitionend', function() {
    overlay.style.setProperty('display', 'none');
  }, false);

} else if (localStorage.getItem('example') === 'hidden') {
  playButton.style.setProperty('visibility', 'hidden');
  example.style.setProperty('display', 'none');
  overlay.style.setProperty('display', 'none');

} else if (localStorage.getItem('display') !== 'none') {
  overlay.style.setProperty('display', 'none');
}


// hidden information

navButton.addEventListener('click', function () {
  let isDisplayed = navButtonText.textContent == 'close' ? 'open' : 'close';

  navButtonText.textContent = isDisplayed;

  header.style.setProperty('visibility', 'visible');
  navButton.classList.toggle('opened');
  header.classList.toggle('hidden');
  game.classList.toggle('hidden');

  /*window.setTimeout(
    () => {
    console.log('hidden')
    header.style.setProperty('display', isDisplayed == 'close' ? 'block' : 'none')
    }, 2000
  );*/

  if (example.clientHeight > 0) {
    example.style.setProperty('opacity', '0');
    window.setTimeout(example.style.setProperty('display', 'none'), 1000);

    localStorage.setItem('example', 'hidden')
  }


  if (isDisplayed === 'open') {
    localStorage.setItem('display', 'none');
  } else {
    localStorage.removeItem('display');
  }


}, false);


/*header.addEventListener('transitionend', function(event) {
  const navButtonText = navButton.querySelector('.nav-button--text');
  let isDisplayed = navButtonText.textContent == 'close' ? 'open' : 'close';

  if (event.propertyName !== 'transform') return;

  console.log(isDisplayed);

  if (isDisplayed == 'close') {
    header.style.setProperty('display', 'none');
  } else {
    header.style.setProperty('display', 'block');
  }

}, false)*/


// play a game

const playGame = document.querySelector('.play-button');

playGame.addEventListener('click', function() {
  example.style.setProperty('opacity', '0');
  window.setTimeout(example.style.setProperty('display', 'none'), 1000);

  localStorage.setItem('example', 'hidden')
}, false);





/*  ball's movement  */

function removeNumbers(name) {
  let changedName;
  let rex = name.search(/\d/g);

  if (rex == -1) {
    changedName = name;
  } else {
    changedName = name.slice(0, rex);
  }

  return changedName;
}

function findIndex(id) {
  let name = removeNumbers(id);
  const elements = document.querySelectorAll(`.${name}`);
  let index = 0;

  elements.forEach(element => {
    let match = element.id.match(/\d/g);

    if (match !== null) {
      match = parseInt(match[0], 10);
      if (match > index) {
        index = match;
      } else {
        return;
      };
    };
  });
  return index + 1;
}

function createElement(className, idName) {
  let element = document.createElement('div');
  let index = findIndex(idName);
  idName = removeNumbers(idName);

  element.className = className;
  element.id = `${idName}${index}`;
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

  if (event.target.parentNode.matches('.slot') ||
      event.target.parentNode.matches('.color-slot')) {
    lastTargetSlot = event.target.parentNode;
  }

  createChild = event.target;

  return true;
}

function onDrop(event) {
  const data = event.dataTransfer.getData("text");
  const target = event.target;
  const targetParent = target.parentNode;

  // ball places in the same room
  if (lastTargetSlot === targetParent) {
    targetParent.appendChild(document.getElementById(data));
  } else {

    if (targetParent.className === 'color-slot') {

      // remove ball
      if (removeNumbers(lastTargetSlot.children[0].id) === removeNumbers(target.id)) {
        lastTargetSlot.removeChild(document.getElementById(data))
      }

      // ball dropped at placeholder
      //else if (lastTargetSlot.className === 'slot') {
        //const newElement = createElement(target.className, target.id);
        //lastTargetSlot.removeChild(createChild);
        //lastTargetSlot.appendChild(newElement);
        //return;
      //}
      return;
    }

    // replace ball from slot to placeholder
    if (createChild.parentNode.matches('.color-slot')) {
      const newElement = createElement(createChild.className, createChild.id);

      // replace ball from placeholder to taken slot
      if (target.matches('.ball')) {
        targetParent.removeChild(target);
        targetParent.appendChild(document.getElementById(data));
        lastTargetSlot.appendChild(newElement);

      // replace ball from placeholder to empty slot
      } else {
        createChild.parentNode.appendChild(newElement);
        target.appendChild(document.getElementById(data));
      }
      return;
    }


    // replace ball from slot to slot
    if (target.matches('.ball') &&
        createChild.parentNode.parentNode === over.parentNode.parentNode) {
      targetParent.removeChild(target);
      targetParent.appendChild(document.getElementById(data));
      lastTargetSlot.append(target);
      return;

    // replace ball from slot to empty slot
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
}


//localStorage.removeItem('example')
