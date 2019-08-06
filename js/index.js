(function initApp(){
  const body = document.getElementsByTagName('body')[0];
  const navButton = document.querySelector('.nav-button');
  const navButtonText = navButton.querySelector('.nav-button--text');
  const header = document.querySelector('.header');
  const game = document.querySelector('.game');
  const example = document.querySelector('.example');
  const placeholder = document.querySelector('colors');
  const playButton = document.querySelector('.play-button');
  // const overlay = document.querySelector('.overlay');
  const confetti = document.querySelector('.confetti');


  function hideRules () {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? true : false;
    let isDisplayed = navButtonText.textContent == 'close' ? 'open' : 'close';

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
    confetti.classList.toggle('confetti--hidden');

    // game.style.transform = navButtonText.textContent == 'close' ?
    // 'none'
    // :
    // 'translateX(calc((550px + (((100vw - 550px - 370px)/3)*2) - ((100vw / 2) - (370px / 2))) * -1))';


    // if example is visible
    if (example.clientHeight > 0) {
      example.classList.add('example-hidden');
      localStorage.setItem('example', 'hidden')
    }


    // if (isDisplayed === 'open') {
    if (navButton.classList.contains("opened")) {
      localStorage.setItem('display', 'none');
    } else {
      localStorage.removeItem('display');
    }
  }


  function handleLocalStorage() {
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? true : false;

    if (!localStorage.getItem('display') && isMobile) {
      navButtonText.textContent = ""
    }

    else if (localStorage.getItem('display') === 'none') {
      if (isMobile) {
        body.classList.add('body--is-mobile');
        navButton.classList.add('nav--is-mobile');
        navButtonText.textContent = "";
      } else {
        navButtonText.textContent = "open"
      }

      navButton.classList.add('opened');
      header.classList.add('hidden');
      game.classList.add('game-hidden');
      confetti.classList.add('confetti--hidden');
      example.style.setProperty('display', 'none');
      // window.setTimeout(example.style.setProperty('display', 'none'), 300);


      // game.addEventListener('transitionend', function() {
      //   overlay.style.setProperty('display', 'none');
      // }, false);

    } else if (localStorage.getItem('example') === 'hidden') {
      playButton.classList.add('example-hidden');
      example.style.setProperty('display', 'none');
      // overlay.style.setProperty('display', 'none');

    // } else if (localStorage.getItem('display') !== 'none') {
    //   overlay.style.setProperty('display', 'none');
    }
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

  handleLocalStorage();
})();
