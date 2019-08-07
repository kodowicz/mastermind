(function initApp(){
  const body = document.getElementsByTagName('body')[0];
  const navButton = document.querySelector('.nav-button');
  const navButtonText = navButton.querySelector('.nav-button--text');
  const header = document.querySelector('.header');
  const game = document.querySelector('.game');
  const example = document.querySelector('.example');
  const playButton = document.querySelector('.play-button');
  const overlay = document.querySelector('.overlay');
  const confetti = document.querySelector('.confetti');

  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                 ? true : false;

  function hideRules () {
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

    // if example is visible
    if (example.clientHeight > 0) {
      example.classList.add('example-hidden');
      localStorage.setItem('example', 'hidden')
    }

    // if header is visible
    if (navButton.classList.contains("opened")) {
      localStorage.setItem('display', 'none');
    } else {
      localStorage.removeItem('display');
    }
  }


  function handleLocalStorage() {
    if (isMobile) {

      if (localStorage.getItem('display')) {
        body.classList.add('body--is-mobile');
        navButton.classList.add('opened');
        navButtonText.textContent = "";
        header.classList.add('hidden');
        game.classList.add('game-hidden');
        confetti.classList.add('confetti--hidden');
        example.style.setProperty('display', 'none');
        overlay.classList.add('overlay--hidden');
      }

      else {
        navButton.classList.add('nav--hidden');

        navButton.addEventListener('transitionend', function() {
          navButtonText.textContent = "";
          overlay.classList.add('overlay--hidden');
        });
      }
    }

    else {
      if (localStorage.getItem('display')) {
        navButtonText.textContent = "open";
        navButton.classList.add('opened');
        header.classList.add('hidden');
        game.classList.add('game-hidden');
        confetti.classList.add('confetti--hidden');
        example.style.setProperty('display', 'none');

        game.addEventListener('transitionend', function() {
          overlay.classList.add('overlay--hidden');
        });
      }

      else if (!localStorage.getItem('display')) {
        navButtonText.textContent = "close";
        navButton.classList.remove('opened');
        overlay.classList.add('overlay--hidden');

        if (localStorage.getItem('example')) {
          example.style.setProperty('display', 'none');
        }
      }
    }
  }

  // hidden information
  navButton.addEventListener('click', function () {
    hideRules();
  });

  // play a game
  playButton.addEventListener('click', function() {
    hideRules();
    localStorage.setItem('example', 'hidden');
  });

  handleLocalStorage();
})();
