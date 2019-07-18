const navButton = document.querySelector('.nav-button');
const navButtonText = navButton.querySelector('.nav-button--text');
const header = document.querySelector('.header');
const game = document.querySelector('.game');
const example = document.querySelector('.example');
const placeholder = document.querySelector('colors');
const playButton = document.querySelector('.play-button');
const overlay = document.querySelector('.overlay');


function hideRules () {
  let isDisplayed = navButtonText.textContent == 'close' ? 'open' : 'close';

  navButtonText.textContent = isDisplayed;

  navButton.classList.toggle('opened');
  header.classList.toggle('hidden');
  game.classList.toggle('hidden');

  // if example is visible
  if (example.clientHeight > 0) {
    example.classList.add('example-hidden');
    localStorage.setItem('example', 'hidden')
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


  game.addEventListener('transitionend', function() {
    overlay.style.setProperty('display', 'none');
  }, false);

} else if (localStorage.getItem('example') === 'hidden') {
  playButton.classList.add('example-hidden');
  example.style.setProperty('display', 'none');
  overlay.style.setProperty('display', 'none');

} else if (localStorage.getItem('display') !== 'none') {
  overlay.style.setProperty('display', 'none');
}


// hidden information
navButton.addEventListener('click', function () {
  hideRules();
}, false);

// play a game
playButton.addEventListener('click', function() {
  playButton.classList.add('example-hidden');

  hideRules();
  localStorage.setItem('example', 'hidden');
}, false);
