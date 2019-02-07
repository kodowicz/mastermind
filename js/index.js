const navButton = document.querySelector('.nav-button');
const navButtonText = navButton.querySelector('.nav-button--text');
const header = document.querySelector('.header');
const game = document.querySelector('.game');
const example = document.querySelector('.example');
const placeholder = document.querySelector('colors');
const playButton = document.querySelector('.play-button');
const overlay = document.querySelector('.overlay');



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
