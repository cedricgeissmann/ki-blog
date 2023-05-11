const canvas = document.querySelector('#canvas');
canvas.width = 16
canvas.height = 16
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
}

function stop() {
  document.removeEventListener('mousemove', draw);
}


function draw(e) {
  ctx.beginPath();
  ctx.lineWidth = 2
  ctx.strokeColor = 'black'
  ctx.moveTo(coords.x, coords.y);
  reposition(e);
  ctx.lineTo(coords.x, coords.y);
  ctx.stroke();
  
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

document.querySelector('#btn-guess').addEventListener('click', async () => {

})

document.querySelector('#btn-save').addEventListener('click', async (e) => {
    let downloadLink = document.createElement('a');
    downloadLink.setAttribute('download', 'CanvasAsImage.png');
    canvas.toBlob(function(blob) {
      let url = URL.createObjectURL(blob);
      downloadLink.setAttribute('href', url);
      downloadLink.click();
    });
})


// Create a neural network object with custom options
const nn = ml5.neuralNetwork({
  // inputs: 784,
  // outputs: 10,
  task: 'classification',
  debug: true,
  layers: [
    {
      type: 'dense',
      units: 128,
      activation: 'relu'
    }
  ]
});

let data = []

async function setup() {
  console.log("setup done");
  data = await fetch('./mnist-medium.json')
    .then((response) => response.json())
  data.forEach((entry) => {
    nn.addData(entry.image.map(x => x / 255.), [`${entry.label}`]);
  })
  // nn.normalizeData();
  nn.train({epochs: 200}, finishedTraining);
}

async function finishedTraining() {
  console.log("finished training");
  for (let i = 0; i < 100; i++) {
    const index = Math.floor(Math.random() * data.length);
    const res = await nn.classify(data[index].image.map(x => x / 255.));
    let label = 0
    let conf = 0
    res.forEach((entry) => {
      if (entry.confidence > conf) {
        label = entry.label
        conf = entry.confidence
      }
    })
    console.log(`Predict label ${label} with confidence ${conf}, true label: ${data[index].label}`);
  }
}

function labelToArray(label) {
  return [`${label}`];
}

function randomLabel() {
  return [`${Math.floor(Math.random() * 2)}`];
}

document.addEventListener('DOMContentLoaded', setup);