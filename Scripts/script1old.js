function setMediaSource() {
    const lookImage = document.getElementById('look_1');
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone')) {
        lookImage.setAttribute('src', './assets/look_4.png');
        lookImage.setAttribute('material', 'transparent: true; alphaTest: 0.5;');
    } else {
        lookImage.setAttribute('src', './assets/Look_2.svg');
    }
}

window.onload = () => {
    setMediaSource(); // Set the media source based on the device
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '<>';
    button.addEventListener('click', changeMedia);

    document.querySelector('a-scene').addEventListener('loaded', function () {
        displayMedia(modelIndex);
    });
};

var media = [
    {
        type: 'image',
        url: './assets/images/02 - TowerBridge - Start.jpg', // Ensure the file name matches exactly, including case sensitivity
        scale: '10 7 1', // Adjust scale as needed
        rotation: '0 90 0', // Adjust rotation as needed
        info: 'Tap the button to play the animation',
    },
    {
        type: 'video',
        url: './assets/videos/02 - TowerBridgeO.mp4', // Ensure the file name matches exactly, including case sensitivity
        scale: '10 7 1', // Adjust scale as needed
        rotation: '0 90 0', // Adjust rotation as needed
        info: 'Tap the button to switch back',
    },
];



var modelIndex = 0;

function changeMedia() {
    modelIndex = (modelIndex + 1) % media.length; // Cycle through the media array
    displayMedia(modelIndex); // Display the selected media
}

function displayMedia(index) {
    let scene = document.querySelector('a-scene');
    let mediaItem = media[index]; // Get the current media item based on index
    let lookImage = document.getElementById('look_1');

    // Remove any existing media before adding new
    let existingMedia = scene.querySelector('a-image:not(#look_1), a-video');
    if (existingMedia) {
        existingMedia.parentNode.removeChild(existingMedia);
    }

    let entity;
    if (mediaItem.type === 'image') {
        entity = document.createElement('a-image');
        entity.setAttribute('src', mediaItem.url);
    } else if (mediaItem.type === 'video') {
        entity = document.createElement('a-video');
        entity.setAttribute('src', mediaItem.url);
        entity.setAttribute('autoplay', 'true');
        entity.setAttribute('loop', 'true');
        entity.setAttribute('playsinline', 'true');
    }

    entity.setAttribute('position', '-25 5 0');
    entity.setAttribute('rotation', mediaItem.rotation);
    entity.setAttribute('scale', mediaItem.scale);

    scene.appendChild(entity);

    // Update instructions
    const div = document.querySelector('.instructions');
    div.innerText = mediaItem.info;

    // Set opposite position for the look-around cue
    let oppositePosition = {
        x: 25, // Invert the X position
        y: 5, // Same Y level
        z: 0  // Same Z level
    };
    lookImage.setAttribute('position', `${oppositePosition.x} ${oppositePosition.y} ${oppositePosition.z}`);
    lookImage.setAttribute('visible', 'true'); // Make sure the SVG is visible when media changes
}