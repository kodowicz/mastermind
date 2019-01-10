const placeholder = document.querySelector('colors');
let lastTargetSlot;
let lastBall;
let createChild;
let over;
let dragStart;

function findIndex(id) {
  let name = id.replace(id[id.length - 1], '');
  const elements = document.querySelectorAll(`.${name}`);
  let index = 1;
  console.log(elements);

  elements.forEach(element => {
    let match = element.id.match(/\d/g);
    console.log(match);
    if (match !== null) {
      match = parseInt(match[0], 10);
      //if (match > index) {
        index = match + 1;
        console.log('index');
      //}
    } else {
      index = 1;
      console.log(index);
    }

  });
  return index;
}

function createElement(className, idName) {
  let index = findIndex(idName);
  let element = document.createElement('div');
  element.className = className;
  element.id = `${idName}${index}`;
  element.setAttribute('draggable', 'true');
  element.setAttribute('ondragstart', 'return onDragStart(event)');
  element.setAttribute('ondragend', 'return onDragEnd(event)');
  element.innerHTML = index;

  return element;
}


function onDragStart(event) {
  createChild = event.target;
  dragStart = event.target;

  event.dataTransfer.effectAllowed='move';
  event.dataTransfer.setData("text", event.target.getAttribute('id'));

  // celem jest element w slot
  if (event.target.parentNode.classList.contains('slot') ||
      event.target.parentNode.classList.contains('color-slot')) {
    lastTargetSlot = event.target.parentNode;

  /*} else if (event.target.parentNode.parentNode == placeholder) {
    lastTargetSlot = event.target.parentNode;
    console.log(lastTargetSlot)*/
  }

  return true;
}


function onDrop(event) {
  const data = event.dataTransfer.getData("text");
  let targetParent = event.target.parentNode;


  // przeniesienie kulki z slot do colors
  if (createChild.parentNode.className === 'color-slot') {
    //console.log('slot -> placeholder');
    const newElement = createElement(
      createChild.className,
      createChild.id
    );
    //createChild.parentNode.appendChild(newElement);
    //event.target.appendChild(document.getElementById(data));

    //console.log(event.target);
    // zamiana kuli z placeholder do zajętego slot
    if (event.target.classList.contains('ball')) {
      targetParent.removeChild(event.target);
      targetParent.appendChild(document.getElementById(data));
      lastTargetSlot.appendChild(newElement);
    } else {
      createChild.parentNode.appendChild(newElement);
      event.target.appendChild(document.getElementById(data));
    }
    return;
  }


  // przeniesienie kulki z slot do slot
  if (event.target.classList.contains('ball') &&
      createChild.parentNode.parentNode === over.parentNode.parentNode) {
    //console.log('slot -> slot');


    //event.target.parentNode.appendChild(document.getElementById(data));

    targetParent.removeChild(event.target);
    targetParent.appendChild(document.getElementById(data));
    lastTargetSlot.append(event.target);

    /*parent.removeChild(event.target);
    //lastTargetSlot.append(event.target);
    parent.appendChild(document.getElementById(data));
    console.log('b')
    const newElement = createElement(
      'div',
      createChild.className,
      createChild.id
    );
    lastTargetSlot.appendChild(newElement);
*/
  return;
  // przeniesienie slot do pustego slot
  } else if (!event.target.classList.contains('ball') && createChild.parentNode.parentNode === over.parentNode.parentNode) {
    event.target.appendChild(document.getElementById(data));
    //console.log('slot -> empty slot');
  // przejście z colors do pustego slota
  } else {
    /*const newElement = createElement(
      'div',
      createChild.className,
      createChild.id
    );
    console.log('else');
    event.target.appendChild(document.getElementById(data));*/
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
