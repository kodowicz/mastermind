let lastTargetSlot;

function onDragStart(event) {
  event.dataTransfer.effectAllowed='move';
  event.dataTransfer.setData("text", event.target.getAttribute('id'));

  if (event.target.parentNode.classList.contains('slot')
      || event.target.parentNode.classList.contains('color-slot')) {
    lastTargetSlot = event.target.parentNode;
  }

  return true;
}


function onDrop(event) {
  const data = event.dataTransfer.getData("text");
  let targetParent = event.target.parentNode;

  event.target.appendChild(document.getElementById(data));

  if (event.target.classList.contains('ball')) {
    targetParent.appendChild(document.getElementById(data));
    lastTargetSlot.appendChild(event.target);
    console.log(event.target);
  } else {
    event.target.appendChild(document.getElementById(data));
  }

  event.stopPropagation();
  return false;
}

function onDragOver(event) {
  event.preventDefault();
}

function onDragEnd(event) {
}
