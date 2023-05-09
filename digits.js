const canvas = document.querySelector('#canvas');
canvas.width = 32
canvas.height = 32
const ctx = canvas.getContext('2d');

let coords = {
  x: 0,
  y: 0
}


document.addEventListener('mousedown', start);

document.addEventListener('mouseup', stop);

function start(e) {
  reposition(e);
  document.addEventListener('mousemove', draw);
  showCoords(coords.x, coords.y);
}

function stop() {
  document.removeEventListener('mousemove', draw);
}


function draw(e) {
  showCoords(coords.x, coords.y);
  ctx.beginPath();
  ctx.lineWidth = 2
  ctx.strokeColor = 'black'
  ctx.moveTo(coords.x, coords.y);
  reposition(e);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
  
}

function showCoords(x, y) {
  document.querySelector('#coords').textContent = `x: ${x}, y: ${y}`;
}

function reposition(e) {
  const bounding = canvas.getBoundingClientRect();
  const x = Math.floor(((e.clientX - bounding.left) / bounding.width) * canvas.width);
  const y = Math.floor(((e.clientY - bounding.top) / bounding.height) * canvas.height);
  coords.x = x
  coords.y = y
}

document.querySelector('#btn-clear').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.querySelector('#btn-guess').addEventListener('click', () => {
  alert("The number is: " + Math.round(Math.random() * 10));
})