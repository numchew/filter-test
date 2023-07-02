var myScreenOrientation = window.screen.orientation;
if (myScreenOrientation && myScreenOrientation.lock) {
    // Lock the screen orientation to a specific mode
    myScreenOrientation.lock('portrait')
        .then(() => {
            console.log('Screen orientation locked successfully.');
        })
        .catch((error) => {
            console.log('Failed to lock screen orientation:', error);
        });
} else {
    console.warn('Screen Orientation API is not supported in this browser.');
}
