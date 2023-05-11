const canvas = document.querySelector('#canvas');
canvas.width = 28
canvas.height = 28
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
  const greyData = new Array(784).fill(0.0);
  const colorData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
  for (let i = 0; i < colorData.length; i += 4) {
    greyData[i / 4] = colorData[i + 3] / 255.0
  }
  nn.classify(greyData, classifyResult);
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

document.querySelector('#btn-display').addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let index = Math.floor(Math.random() * data.length)
  let selectedData = data[index].image
  document.querySelector('#label-display').textContent = data[index].label
  for (let i = 0; i < selectedData.length; i++){
    imgData.data[i * 4 + 3] = selectedData[i]
  }
  ctx.putImageData(imgData, 0, 0);
})


// Create a neural network object with custom options
const nn = ml5.neuralNetwork({
  inputs: 784,
  outputs: 10,
  task: 'classification',
  debug: true,
  layers: [
    {
      type: 'dense',
      units: 10,
      activation: 'softmax'
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
  nn.train({epochs: 50}, whileTraining, finishedTraining);
}

function whileTraining(epoch, loss) {
  console.log(`Epoch ${epoch}: `, loss);
}

async function finishedTraining() {
  console.log("finished training");
  for (let i = 0; i < 100; i++) {
    const index = Math.floor(Math.random() * data.length);
    nn.classify(data[index].image.map(x => x / 255.), classifyResult);
    console.log(data[index].label);
  }
}

function classifyResult(error, res) {
  if (error) {
    console.log(error);
  }
    let label = 0
    let conf = 0
    res.forEach((entry) => {
      if (entry.confidence > conf) {
        label = entry.label
        conf = entry.confidence
      }
    })
    console.log(`Predict label ${label} with confidence ${conf}`);
}

function labelToArray(label) {
  return [`${label}`];
}

function randomLabel() {
  return [`${Math.floor(Math.random() * 2)}`];
}

document.addEventListener('DOMContentLoaded', setup);