(function initGame(){
  const balls = document.querySelectorAll(".ball");
  const slots = document.querySelectorAll(".slot");
  const hideElement = document.querySelector('.header');
  const slideElement = document.querySelector('.game');
  const navBtnText = document.querySelector('.nav-button--text');

  let isMoved = false;
  let ball;


  function elementTranslation(element1, element2) {
    const transition = ((element1.offsetWidth +
      (((window.innerWidth - element1.offsetWidth - element2.offsetWidth) / 3) * 2) -
      ((window.innerWidth / 2) - (element2.offsetWidth / 2))) * -1);

    return navBtnText.textContent == 'close' ? 0 : transition;
  }

  function exactPosition(element) {
    let Xposition = 0;
    let Yposition = 0;
    let translation = elementTranslation(hideElement, slideElement);

    while (element) {
      if (element.tagName == "body") {
        let xScroll = element.scrollLeft || document.documentElement.scrollLeft;
        let yScroll = element.scrollTop || document.documentElement.scrollTop;

        Xposition += (element.offsetLeft - xScroll + element.clientLeft);
        Yposition += (element.offsetTop - yScroll + element.clientTop);

      } else {    // for all non-body elements
        Xposition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        Yposition += (element.offsetTop - element.scrollTop + element.clientTop);
      }
      element = element.offsetParent
    }

    return {
      x: Xposition + translation,
      y: Yposition //+ translation.y
    }
  }

  function getSlotPosition(slots) {
    let slotsPosition = [];

    slots.forEach(slot => {
      let coordinates = Object.assign({}, {
        left: exactPosition(slot).x,
        right: exactPosition(slot).x + slot.offsetWidth,
        top: exactPosition(slot).y,
        bottom: exactPosition(slot).y + slot.offsetHeight
      });

      slotsPosition.push(coordinates);
    })

    return slotsPosition
  }

  function getSlotTarget(slots, event) {
    let slotTargetIndex;

    slots.forEach((slot, index) => {
      if ( event.pageX > slot.left &&
         event.pageX < slot.right &&
         event.pageY > slot.top &&
         event.pageY < slot.bottom
       ) {
        slotTargetIndex = index
      }
    })

    if (slotTargetIndex === undefined) {
      slotTargetIndex = -1
    }

    return slotTargetIndex;
  }

  function moveBall(element, event) {
    let parentPosition = exactPosition(element);
    let positionY = event.clientY - parentPosition.y -  (element.offsetHeight / 2);
    let positionX = event.clientX - parentPosition.x - (element.offsetWidth / 2);

    element.style.transform = `translate(${positionX}px, ${positionY}px)`;

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
    element.addEventListener("mousedown", startMovingBall)

    return element;
  }

  function startMovingBall(event) {
    ball = event.target;
    isMoved = true;
  }

  function keepMovingBall(event) {
    if (isMoved) {
      moveBall(ball, event)
    }
  }

  function finishMovingBall(event) {
    const colorSlots = document.querySelectorAll(".color-slot");
    const colorSlotsPosition = getSlotPosition(colorSlots);
    const colorSlotTargetIndex = getSlotTarget(colorSlotsPosition, event);

    const slotsPosition = getSlotPosition(slots);
    const slotTargetIndex = getSlotTarget(slotsPosition, event);
    const slotTarget = slots[slotTargetIndex];

    let ballParent;
    if (ball) ballParent = ball.parentNode;


    // usunięcie ball z slot
    if (colorSlotTargetIndex > -1 ) {
      const colorSlot = colorSlots[colorSlotTargetIndex].firstElementChild.getAttribute("data-color");
      const ballSlot = ballParent.firstElementChild.getAttribute("data-color");

      if (colorSlot === ballSlot && ballParent.matches(".slot")) {
        ball.remove();
      }
    }

    /* assign ball */
    if (slotTargetIndex > -1) {

      // gdy slot jest zajęty
      if (slotTarget.childElementCount === 1) {
        const slotTargetParent = slots[slotTargetIndex].parentNode;

        // slot na ten sam slot
        if (ballParent.matches(".slot") && ball.parentNode == slotTarget) {
          ball.style.transform = "none";

        // zamiana slot na slot
        } else if (ballParent.matches(".slot")) {
          assignBallToSlot(ballParent, slotTarget.lastChild, ballParent, slotTarget);

        // zamiana placeholder na slot
        } else if (ballParent.matches(".color-slot")) {
          const newElement = createElement(ball.className, ball.id);
          assignBallToSlot(slotTarget, newElement, ballParent, slotTarget);
        }

      } else {
        // zmiana z slot na pusty slot
        if (ballParent.matches(".slot")) {
          assignBallToSlot(ballParent, null, ballParent, slotTarget);
        }

        // zmiana z placeholder na pusty slot
        else {
          const newElement = createElement(ball.className, ball.id);
          assignBallToSlot(slotTarget, newElement, ballParent, slotTarget);
        }
      }

    } else if (ball) {
      ball.style.transform = 'none'
    }

    isMoved = false;
    lastTargetSlot = null;
    ball = null;
  }


  balls.forEach(ball =>
    ball.addEventListener("mousedown", startMovingBall)
  );
  document.addEventListener("mousemove", keepMovingBall);
  document.addEventListener("mouseup", finishMovingBall);
}());
