// Set constraints for the video stream
let currentFacingMode = 'user';
//var constraints = { video: { facingMode: currentFacingMode }, audio: false };
var track = null;

// Define constants
const video = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    audioElement = document.getElementById('soundEffect');

const preview = document.getElementById('previewElement');

const ctx = cameraOutput.getContext('2d');
var width, height;
var stage, container;

var cSetIndex = 0;
var imgIndex = 0;
var intervalId;
var charPath = '';

var logoImg;

function handleVideo() {
    currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
    const constraints = {
        video: {
            facingMode: currentFacingMode
        }, audio: false
    }
    return constraints
};

function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    logoImg = new Image();
    logoImg.src = './assets/ui/ngold_logo.png'
    /* loadImage('./assets/ui/ngold_logo.png')
        .then((logo) => {
            logoImg = logo;
        })
        .catch((error) => {
            console.error(error);
        }); */

    toggleCamera();

    video.addEventListener('play', function () {
        cameraOutput.width = video.videoWidth;
        cameraOutput.height = video.videoHeight;
        drawVideoFrame();
    });
}

///// switch camera /////
function toggleCamera() {
    var constraints = handleVideo();
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            //track = stream.getTracks()[0];
            video.srcObject = stream;
            //currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
}

///// draw frame /////
function drawVideoFrame() {
    if (charPath == "") {
        drawImageSmoothly(logoImg, null);
    } else {
        /* loadImage(charPath)
            .then((img) => {
                drawImageSmoothly(logoImg, img);
            })
            .catch((error) => {
                console.error(error);
            }); */

        const img = new Image();
        img.src = charPath;
        img.onload = function () {
            drawImageSmoothly(logoImg, img);
        }

    }


    requestAnimationFrame(drawVideoFrame);
}

function drawImageSmoothly(logo, img) {
    // Calculate the desired width and height of the image on the canvas
    const aspectRatio = logo.width / logo.height;
    const maxWidth = cameraOutput.width;
    const maxHeight = cameraOutput.height;
    //let width = maxWidth;
    let width = 120;
    let height = width / aspectRatio;

    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }

    ///// camera /////
    ctx.clearRect(0, 0, cameraOutput.width, cameraOutput.height);
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, -cameraOutput.width, cameraOutput.height);
    ctx.restore();

    ///// logo /////
    ctx.drawImage(logo, 0, 0, logo.width, logo.height, (cameraOutput.width - width) / 2, -45, width, height);

    ///// char /////
    if (img) {
        var imgWidth = img.naturalWidth;
        var imgHeight = img.naturalHeight;
        const aspectRatioImg = imgWidth / imgHeight;
        const fixedHeight = 500;
        const fixedWidth = fixedHeight * aspectRatioImg;
        const x = cameraOutput.width - fixedWidth;
        const y = cameraOutput.height - fixedHeight;

        console.log(x, y);
        // ctx.drawImage(img, imgWidth / 4 - 50, 0, imgWidth / 4, imgHeight / 4);
        ctx.drawImage(img, x - 120, y, fixedWidth, fixedHeight /* */);


        /*  
        var imgWidth = img.naturalWidth;
        var imgHeight = img.naturalHeight;
         ctx.drawImage(img, imgWidth / 4 - 50, 0, imgWidth / 4, imgHeight / 4); */
    }
}


function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        image.src = url;
    });
}
//////////////////////////////////////////////////
function capture() {
    preview.src = cameraOutput.toDataURL("image/png");
    preview.classList.remove("fadeout");
    preview.classList.remove("taken");
    preview.hidden = false;
    setTimeout(function () { preview.classList.add("taken"); }, 1);
    setTimeout(function () { preview.classList.add("fadeout"); }, 5000);

    cameraOutput.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'captured-image.png';
        link.click();
        URL.revokeObjectURL(link.href);
    }, 'image/png');
}

function fadeout() {
    const link = document.createElement('a');
    link.href = preview;
    link.download = 'captured-image.png';
    link.click();
    preview.classList.remove("taken");
    preview.classList.add("fadeout");
}

//////////////////////////////////////////////////
///// png sequence /////
function changeSet(id) {
    cSetIndex = id;
    imgIndex = 0;
    clearInterval(intervalId);
    intervalId = setInterval(updateImg, 40);

    audioElement.src = imgSets[cSetIndex].audio;
    audioElement.play();
}

function updateImg() {
    var currentSet = imgSets[cSetIndex];
    if (imgIndex >= currentSet.images.length) {
        imgIndex = 0;
        clearInterval(intervalId);
        return;
    }
    charPath = currentSet.images[imgIndex++];
}

//////////////////////////////////////////////////
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');

btn1.addEventListener('click', () => {
    btn1.src = './assets/ui/UI_Nes_botton01_b.png';
    btn2.src = './assets/ui/UI_Nes_botton02_a.png';
    btn3.src = '../assets/ui/UI_Nes_botton03_a.png';
    btn4.src = '../assets/ui/UI_Nes_botton04_a.png';
    changeSet(0);
});
btn2.addEventListener('click', () => {
    btn1.src = './assets/ui/UI_Nes_botton01_a.png';
    btn2.src = './assets/ui/UI_Nes_botton02_b.png';
    btn3.src = '../assets/ui/UI_Nes_botton03_a.png';
    btn4.src = '../assets/ui/UI_Nes_botton04_a.png';
    changeSet(1);
});
btn3.addEventListener('click', () => {
    btn1.src = './assets/ui/UI_Nes_botton01_a.png';
    btn2.src = './assets/ui/UI_Nes_botton02_a.png';
    btn3.src = './assets/ui/UI_Nes_botton03_b.png';
    btn4.src = './assets/ui/UI_Nes_botton04_a.png';
    changeSet(2);
});
btn4.addEventListener('click', () => {
    btn1.src = './assets/ui/UI_Nes_botton01_a.png';
    btn2.src = './assets/ui/UI_Nes_botton02_a.png';
    btn3.src = './assets/ui/UI_Nes_botton03_a.png';
    btn4.src = './assets/ui/UI_Nes_botton04_b.png';
    changeSet(3);
});
//////////////////////////////////////////////////
window.addEventListener("load", init, true);