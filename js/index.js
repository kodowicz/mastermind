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
    if (isMobile) {
      body.classList.toggle('body--is-mobile');
      navButtonText.textContent = "";
      navButton.classList.toggle('opened');
      confetti.classList.toggle('confetti--hidden');

      if (navButton.classList.contains("opened")) {
        body.classList.add('header--hidden');
        body.classList.remove('header--visible');

        window.setTimeout(() => {
          header.style.display = "none"
        }, 300);

      } else {
        header.style.display = "flex";

        window.setTimeout(() => {
          body.classList.remove('header--hidden');
          body.classList.add('header--visible');
        }, 100);
      }

    }

    else {
      let isDisplayed = navButtonText.textContent == 'close' ? 'open' : 'close';
      navButtonText.textContent = isDisplayed;


      navButton.classList.toggle('opened');
      body.classList.toggle('header--hidden');
      confetti.classList.toggle('confetti--hidden');

    }

    // if example is visible
    if (example.clientHeight > 0) {
      body.classList.add('example--hidden');
      localStorage.setItem('example', 'hidden');
      localStorage.setItem('display', 'none');
    }

    // if header is visible
    if (navButton.classList.contains("opened")) {
      localStorage.setItem('display', 'none');
    } else {
      localStorage.removeItem('display');
    }
  }

  function handleLocalStorage() {
    // mobile
    if (isMobile) {
      if (localStorage.getItem('display')) {
        body.classList.add('body--is-mobile');
        body.classList.add('example--hidden');
        body.classList.add('header--hidden');
        navButton.classList.add('opened');
        navButtonText.textContent = "";
        confetti.classList.add('confetti--hidden');
        overlay.classList.add('overlay--hidden');

        header.style.display = "none"
      }

      else {
        navButton.classList.add('nav--hidden');

        navButton.addEventListener('transitionend', function() {
          navButtonText.textContent = "";
          overlay.classList.add('overlay--hidden');
        });

        if (localStorage.getItem('example')) {
          body.classList.add('example--hidden');
        }
      }
    }

    // desktop
    else {
      if (localStorage.getItem('display')) {
        navButtonText.textContent = "open";
        navButton.classList.add('opened');
        body.classList.add('header--hidden');
        body.classList.add('example--hidden');
        confetti.classList.add('confetti--hidden');

        game.addEventListener('transitionend', function() {
          overlay.classList.add('overlay--hidden');
        });
      }

      else if (!localStorage.getItem('display')) {
        navButtonText.textContent = "close";
        navButton.classList.remove('opened');
        overlay.classList.add('overlay--hidden');

        if (localStorage.getItem('example')) {
          body.classList.add('example--hidden');
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
