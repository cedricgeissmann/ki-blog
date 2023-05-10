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
      
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const greyData = new Array(data.length / 4).fill(0);
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    greyData[i / 4] = avg;
  }
  console.log(greyData)
  //alert("The number is: " + Math.round(Math.random() * 10));
  const imgNew = new Image();
  imgNew.src = canvas.toDataURL();
  console.log(imgNew)

  //  the actual classification using the trained classfier
  const classification = await classifier.classify(imgNew);
  console.log(classification);
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


let featureExtractor;
let classifier;

const trainingImages = [];
const NUM_TRAIN = 8;

function preloadImages() {
  console.log('Preloading images');
  const trainingFolderUrl = 'images/training';
  
  const trainingFolders = new Array(NUM_TRAIN).fill(0).map((_, i) => i + 1);
  const imagesNames = new Array(10).fill(0).map((_, i) => `${i}.png`);
  
  trainingFolders.forEach((folderName) => {
    imagesNames.forEach((imageName, i) => {
      const imageUrl = `${trainingFolderUrl}/${folderName}/${imageName}`;
      trainingImages.push({ image: createImg(imageUrl), label: i });
    })
  })
}

function createImg(url) {
  const img = new Image();
  img.src = url;
  return img;
}

function trainModel() {
  const promises = [];
  trainingImages.forEach((dp) => {
    promises.push(classifier.addImage(dp.image, dp.label));  
  });

  return Promise.all(promises);
}

async function modelLoaded() {
  classifier = featureExtractor.classification();

  //  add new train image for every image/label pair stored in `trainingImages`
  await trainModel();
  
  // Retrain the network 
  console.log('training model')
  await classifier.train(function(lossValue) {
    console.log("Loss is", lossValue);
  });
  console.log("Training done")

}

function setup() {
  console.log("setup");
  preloadImages()
  featureExtractor = ml5.featureExtractor("MobileNet", { numLabels: 10 }, modelLoaded);
  console.log("setup done");
}

document.addEventListener('DOMContentLoaded', setup);