(function initApp(){
  const navigation = document.getElementById('navigation');
  const navigationText = navigation.querySelector('.nav__button-text');
  const header = document.querySelector('.header');
  const game = document.querySelector('.game');
  const example = document.querySelector('.example');
  const playButton = document.getElementById('play-game');
  const overlay = document.querySelector('.overlay');
  const confetti = document.querySelector('.confetti');

  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                 ? true : false;

  function hideRules () {
    if (isMobile) {
      document.body.classList.toggle('body--is-mobile');
      navigationText.textContent = "";
      navigation.classList.toggle('opened');
      confetti.classList.toggle('confetti--hidden');

      if (navigation.classList.contains("opened")) {
        document.body.classList.add('header--hidden');
        document.body.classList.remove('header--visible');

        window.setTimeout(() => {
          header.style.display = "none"
        }, 300);

      } else {
        header.style.display = "flex";

        window.setTimeout(() => {
          document.body.classList.remove('header--hidden');
          document.body.classList.add('header--visible');
        }, 100);
      }

    }

    else {
      let isDisplayed = navigationText.textContent == 'close' ? 'open' : 'close';
      navigationText.textContent = isDisplayed;


      navigation.classList.toggle('opened');
      document.body.classList.toggle('header--hidden');
      confetti.classList.toggle('confetti--hidden');

    }

    // if example is visible
    if (example.clientHeight > 0) {
      document.body.classList.add('example--hidden');
      localStorage.setItem('display-example', 'hidden');
      localStorage.setItem('display-rules', 'none');
    }

    // if header is visible
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
      }

      else {
        navigation.classList.add('nav--hidden');
        navigationText.textContent = "";
        overlay.classList.add('overlay--hidden');

        if (localStorage.getItem('display-example') === "hidden") {
          document.body.classList.add('example--hidden');
        }
      }
    }

    // desktop
    else {
      if (localStorage.getItem('display-rules') === "none") {
        navigationText.textContent = "open";
        navigation.classList.add('opened');
        document.body.classList.add('header--hidden');
        document.body.classList.add('example--hidden');
        confetti.classList.add('confetti--hidden');

        window.setTimeout(() => {
          overlay.classList.add('overlay--hidden');
        }, 700);
      }

      else {
        navigationText.textContent = "close";
        navigation.classList.remove('opened');
        overlay.classList.add('overlay--hidden');

        if (localStorage.getItem('display-example')) {
          document.body.classList.add('example--hidden');
        }
      }
    }
  }

  // hidden information
  navigation.addEventListener('click', function () {
    hideRules();
  });

  // play a game
  playButton.addEventListener('click', function() {
    hideRules();
    localStorage.setItem('display-example', 'hidden');
  });

  handleLocalStorage();
})();
