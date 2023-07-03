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
var imgElement;
var imgIndex = -1;
var intervalId;
var charPath = '';

var logoImg;
var isOpening = false;

var images_arr = [new Array(), new Array(), new Array(), new Array()];
var img_curr;
const numframes = 125
const frameRate = 25;


preloadImages(null, images_arr[0], 'assets/img1/img (');
preloadImages(null, images_arr[1], 'assets/img2/img (');
preloadImages(null, images_arr[2], 'assets/img3/img (');
preloadImages(null, images_arr[3], 'assets/img4/img (');
function preloadImages(callback, arr, prefix) {
    let loadedImages = 0;
    function loadImage(index) {
        const image = new Image();
        image.src = prefix + index + ').png';
        image.onload = function () {
            loadedImages++;
            if (loadedImages === numframes && callback) {
                callback();
            }
        };
        arr[index - 1] = image;
    }

    for (let i = 1; i <= numframes; i++) {
        loadImage(i);
    }
}

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

    toggleCamera();

    video.addEventListener('play', function () {
        cameraOutput.width = video.videoWidth;
        cameraOutput.height = video.videoHeight;
        requestAnimationFrame(drawVideoFrame);
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
            if (isOpening) {
                cameraOutput.classList.add('flip-animation');
                setTimeout(() => {
                    cameraOutput.classList.remove('flip-animation');
                }, 500);
            }
            isOpening = true;
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });
}

///// draw frame /////
function drawVideoFrame() {
    if (imgIndex < 0/* charPath == "" */) {
        drawImageSmoothly(logoImg, null);
    } else {
        /* const img = new Image();
        img.src = charPath;
        img.onload = function () {
            drawImageSmoothly(logoImg, img);
        } */


        /* preloadImages(function () {
            
        }); */

        img_curr = images_arr[cSetIndex][imgIndex];

        if (imgIndex >= numframes - 1) {
            imgIndex = numframes - 1;
        } else {
            imgIndex++;
        }

        drawImageSmoothly(logoImg, img_curr);
        //drawImageSmoothly(logoImg, images_1);
    }
    //requestAnimationFrame(drawVideoFrame);

    setTimeout(() => drawVideoFrame(), 40);
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
        //const aspectRatioImg = imgHeight / imgWidth;
        const fixedHeight = 800;
        const fixedWidth = fixedHeight * aspectRatioImg;

        const x = cameraOutput.width - fixedWidth;
        const y = cameraOutput.height - fixedHeight;
        ctx.drawImage(img, x, y, fixedWidth, fixedHeight);
    }
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
    clearInterval(intervalId);
    cSetIndex = id;
    imgIndex = 0;
    audioElement.src = imgSets[cSetIndex].audio;
    //imgElement = imgSets[cSetIndex].images;
    audioElement.play();
    //intervalId = setInterval(updateImg, 40);

}

/* function updateImg() {
    if (imgIndex >= imgElement.length) {
        clearInterval(intervalId);
        return;
    }
    charPath = imgElement[imgIndex++];
    img_curr = images_1[imgIndex++];
} */

//////////////////////////////////////////////////
const btn1 = document.getElementById('btn1');
const btn2 = document.getElementById('btn2');
const btn3 = document.getElementById('btn3');
const btn4 = document.getElementById('btn4');

btn1.addEventListener('click', () => {
    btn1.src = './assets/ui/UI_Nes_botton01_b.png';
    btn2.src = './assets/ui/UI_Nes_botton02_a.png';
    btn3.src = './assets/ui/UI_Nes_botton03_a.png';
    btn4.src = './assets/ui/UI_Nes_botton04_a.png';
    changeSet(0);
});
btn2.addEventListener('click', () => {
    btn1.src = './assets/ui/UI_Nes_botton01_a.png';
    btn2.src = './assets/ui/UI_Nes_botton02_b.png';
    btn3.src = './assets/ui/UI_Nes_botton03_a.png';
    btn4.src = './assets/ui/UI_Nes_botton04_a.png';
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