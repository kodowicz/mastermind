(function initGame(){
  const balls = document.querySelectorAll(".ball");
  const slots = document.querySelectorAll(".slot");
  const colorSlots = document.querySelectorAll(".color-slot");

  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                 ? true : false;

  let ball;
  let ballsPosition;
  let ballTargetIndex;
  let ballTarget;
  let ballParent;
  let isMoved = false;


  function elementTranslation(element) {
    const game = document.querySelector('.game');
    const style = window.getComputedStyle(game);
    const matrix = new WebKitCSSMatrix(style.webkitTransform);

    return matrix.m41
  }

  function exactPosition(element) {
    let Xposition = 0;
    let Yposition = 0;
    let translation = elementTranslation();

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

  function getTarget(slots, event) {
    let slotTargetIndex;
    const offsetX = isMobile ? event.targetTouches[0].pageX : event.pageX
    const offsetY = isMobile ? event.targetTouches[0].pageY : event.pageY

    slots.forEach((slot, index) => {
      if ( offsetX > slot.left &&
         offsetX < slot.right &&
         offsetY > slot.top &&
         offsetY < slot.bottom
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
    if (!isMobile) element.addEventListener("mousedown", startMovingBall);
    return element;
  }

  // desktop move ball
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
    const colorSlotsPosition = getSlotPosition(colorSlots);
    const colorSlotTargetIndex = getTarget(colorSlotsPosition, event);

    const slotsPosition = getSlotPosition(slots);
    const slotTargetIndex = getTarget(slotsPosition, event);
    const slotTarget = slots[slotTargetIndex];

    let ballParent;
    if (ball) ballParent = ball.parentNode;


    // remove slot
    if (colorSlotTargetIndex > -1 ) {
      const colorSlot = colorSlots[colorSlotTargetIndex].firstElementChild.getAttribute("data-color");
      const ballSlot = ballParent.firstElementChild.getAttribute("data-color");

      if (colorSlot === ballSlot && ballParent.matches(".slot")) {
        ball.remove();
      }
    }

    /* assign ball */
    if (slotTargetIndex > -1) {

      // if slot is taken
      if (slotTarget.childElementCount === 1) {
        const slotTargetParent = slots[slotTargetIndex].parentNode;
        const newElement = createElement(ball.className, ball.id);

        // ball placed in the same room
        if (ballParent.matches(".slot") && ball.parentNode == slotTarget) {
          ball.style.transform = "none";

        // replace ball from slot to empty slot
        } else if (ballParent.matches(".slot")) {
          assignBallToSlot(ballParent, slotTarget.lastChild, ballParent, slotTarget);

        // replace ball from placeholder to taken slot
        } else if (ballParent.matches(".color-slot")) {
          assignBallToSlot(slotTarget, newElement, ballParent, slotTarget);
        }

      } else {
        // replace ball from slot to empty slot
        if (ball && ballParent.matches(".slot")) {
          assignBallToSlot(ballParent, null, ballParent, slotTarget);
        }

        // replace ball from placeholder to empty slot
        else if (ball) {
          const newElement = createElement(ball.className, ball.id);
          assignBallToSlot(slotTarget, newElement, ballParent, slotTarget);
        }
      }

    } else if (ball) {
      ball.style.transform = 'none'
    }

    isMoved = false;
    ball = null;
  }

  // mobile move ball
  function touchingBall(event) {
    if (isMoved) {
      const slots = document.querySelectorAll(".slot");
      const colorSlots = document.querySelectorAll(".color-slot");

      const colorSlotsPosition = getSlotPosition(colorSlots);
      const colorSlotTargetIndex = getTarget(colorSlotsPosition, event);
      const colorSlotTarget = colorSlots[colorSlotTargetIndex];

      const slotsPosition = getSlotPosition(slots);
      const slotTargetIndex = getTarget(slotsPosition, event);
      const slotTarget = slots[slotTargetIndex];
      let slotTargetParent;
      slotTargetParent = slotTarget ? slotTarget.parentNode : null;

      ballTarget.classList.remove('ball--target');

      if (slotTarget || colorSlotTarget) {
        if (colorSlotTarget) {
          // uncklick ball
          if (ballTarget === event.target) {
            isMoved = false;

          // remove ball from slot
          } else if (colorSlotTarget.firstElementChild.getAttribute("data-color") === ballTarget.getAttribute("data-color")) {
            ballParent.innerHTML = "";
            isMoved = false;

          // change chosen ball
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
            isMoved = false;

          // replace ball from slot to empty slot
          } else if (slotTarget && !slotTarget.childElementCount) {
            assignBallToSlot(ballParent, null, ballParent, slotTarget);
            isMoved = false;
          }

        // replace ball from slot to placeholder
        } else if (ballTarget.parentNode.matches('.color-slot')) {
          const newElement = createElement(ballTarget.className, ballTarget.id);

          // replace ball from placeholder to taken slot
          if (slotTarget && slotTarget.childElementCount) {
            ballParent.innerHTML = "";
            ballParent.appendChild(newElement);
            slotTarget.innerHTML = "";
            slotTarget.appendChild(ballTarget);
            isMoved = false;

          // replace ball from placeholder to empty slot
          } else if (slotTarget) {
            ballParent.innerHTML = "";
            ballParent.appendChild(newElement);
            slotTarget.appendChild(ballTarget);
            isMoved = false;
          }
        }

      // click outside of picking zone
      } else {
        isMoved = false;
      }

    } else {
      if (event.target.matches(".ball")) {
        // new list of balls
        const balls = document.querySelectorAll(".ball");

        ball = event.target;
        ballsPosition = getSlotPosition(balls);
        ballTargetIndex = getTarget(ballsPosition, event);
        ballTarget = balls[ballTargetIndex];
        ballParent = ballTarget.parentNode;

        ballTarget.classList.add('ball--target');
        isMoved = true;
      }
    }
  };


  if (isMobile) {
    document.addEventListener("touchstart", touchingBall);
  } else {
    balls.forEach(ball => ball.addEventListener("mousedown", startMovingBall));
    document.addEventListener("mousemove", keepMovingBall);
    document.addEventListener("mouseup", finishMovingBall);
  }
}());
