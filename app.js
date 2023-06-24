const video = document.getElementById('videoElement');
const canvas = document.getElementById('canvasElement');
const preview = document.getElementById('previewElement');
const audioElement = document.getElementById('soundEffect');
const ctx = canvas.getContext('2d');

var constraints = { video: { facingMode: "user" }, audio: false };
var cSetIndex = 0;
var imgIndex = 0;
var intervalId;
var imagePath;

function cameraStart() {
    // Check for browser support
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
            changeSet(0);
        })
        .catch(function (error) {
            console.error("Oops. Something is broken.", error);
        });

    // Draw video frames onto the canvas
    function drawVideoFrame() {
        filter();
        requestAnimationFrame(drawVideoFrame);
    }

    // Start drawing video frames
    video.addEventListener('play', function () {
        requestAnimationFrame(drawVideoFrame);
    });
}

function updateImg() {
    var currentSet = imgSets[cSetIndex];
    if (imgIndex >= currentSet.images.length) {
        imgIndex = 0;
        clearInterval(intervalId);
        return;
    }
    imagePath = currentSet.images[imgIndex++];
}

function filter() {
    var img = new Image;
    img.src = imagePath;
    img.onload = function () {
        var imgWidth = img.naturalWidth;
        var screenWidth = canvas.width;
        var scaleX = 1;
        if (imgWidth > screenWidth)
            scaleX = screenWidth / imgWidth;
        var imgHeight = img.naturalHeight;
        var screenHeight = canvas.height;
        var scaleY = 1;
        if (imgHeight > screenHeight)
            scaleY = screenHeight / imgHeight;
        scale = scaleY;
        if (scaleX < scaleY)
            scale = scaleX;
        if (scale < 1) {
            imgHeight = imgHeight * scale;
            imgWidth = imgWidth * scale;
        }

        canvas.height = imgHeight;
        canvas.width = imgWidth;
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width * -1, canvas.height);

        ctx.restore();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

function capture() {
    preview.src = canvas.toDataURL("image/png");
    preview.classList.remove("taken");
    preview.hidden = false;
    setTimeout(function () { preview.classList.add("taken"); }, 1);
}

function changeSet(id) {
    cSetIndex = id;
    imgIndex = 0;
    clearInterval(intervalId);
    intervalId = setInterval(updateImg, 40);

    audioElement.src = imgSets[cSetIndex].audio;
    audioElement.play();
}

window.addEventListener("load", cameraStart, false);