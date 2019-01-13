const placeholder = document.querySelector('colors');
let lastTargetSlot;
let lastBall;
let createChild;
let over;
let dragStart;

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
  createChild = event.target;
  dragStart = event.target;

  event.dataTransfer.effectAllowed='move';
  event.dataTransfer.setData("text", event.target.getAttribute('id'));

  // celem jest element w slot
  if (event.target.parentNode.matches('.slot') ||
      event.target.parentNode.matches('.color-slot')) {
    lastTargetSlot = event.target.parentNode;
  }
  return true;
}


function onDrop(event) {
  const data = event.dataTransfer.getData("text");
  let targetParent = event.target.parentNode;

  //console.log(createChild);


  // ball w to samo miejsce gdzie było
  if (lastTargetSlot === targetParent) {
    targetParent.appendChild(document.getElementById(data));
  } else {

    if (targetParent.className === 'color-slot') {

      // usunięcie kulki z slot
      if (removeNumbers(lastTargetSlot.children[0].id) === removeNumbers(event.target.id)) {
        lastTargetSlot.removeChild(document.getElementById(data))
        //console.log('usunięcie kulki z slot');
      } else {
        // placeholder na placeholder
        //console.log('placeholder na placeholder lub kulka na placeholder');
      }

      // kulka na placeholder
      //if (lastTargetSlot.className === 'slot') {
        //const newElement = createElement(event.target.className, event.target.id);
        //lastTargetSlot.removeChild(createChild);
        //lastTargetSlot.appendChild(newElement);
        ////console.log('kulka na placeholder');        // usunąć tę opcję
        //return;
      //}
      return;
    }

  // przeniesienie kulki z slot do colors
    if (createChild.parentNode.matches('.color-slot')) {
      const newElement = createElement(createChild.className, createChild.id);

      // zamiana kuli z placeholder do zajętego slot
      if (event.target.matches('.ball')) {
        targetParent.removeChild(event.target);
        targetParent.appendChild(document.getElementById(data));
        lastTargetSlot.appendChild(newElement);
        //console.log('zamiana kuli z placeholder do zajętego slot');
      } else {
        createChild.parentNode.appendChild(newElement);
        event.target.appendChild(document.getElementById(data));
        //console.log('przeniesienie kulki z colors do pustego slot');
      }
      return;
    }


    // przeniesienie kulki z slot do slot
    if (event.target.matches('.ball') &&
        createChild.parentNode.parentNode === over.parentNode.parentNode) {

      targetParent.removeChild(event.target);
      targetParent.appendChild(document.getElementById(data));
      lastTargetSlot.append(event.target);
      //console.log('przeniesienie kulki z slot do slot');
      return;

    //} else if (!event.target.classList.contains('ball')
    //          && createChild.parentNode.parentNode === over.parentNode.parentNode) {
    //  event.target.appendChild(document.getElementById(data));

    // przeniesienie slot do pustego slot
    } else {
      event.target.appendChild(document.getElementById(data))
      //console.log('przeniesienie slot do pustego slot');
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
