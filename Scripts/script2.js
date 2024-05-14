window.onload = () => {
    setMediaSource(); // Set the media source based on the device
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '<>';
    button.addEventListener('click', changeMedia);

    // Ensure scene loaded event is handled correctly
    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        displayMedia(modelIndex); // Initial media display
    } else {
        scene.addEventListener('loaded', function () {
            displayMedia(modelIndex); // Initial media display
        });
    }
};

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

var media = [
    {
        type: 'image',
        url: './assets/images/02 - TowerBridge - Start.jpg',
        scale: '10 7 1',
        rotation: '0 90 0',
        info: 'Tap the button to play the animation',
    },
    {
        type: 'video',
        url: './assets/videos/02 - TowerBridgeO.mp4',
        scale: '10 7 1',
        rotation: '0 90 0',
        info: 'Tap the button to switch back',
    },
];

var modelIndex = 0;

function changeMedia() {
    modelIndex = (modelIndex + 1) % media.length;
    displayMedia(modelIndex);
}

function displayMedia(index) {
    let scene = document.querySelector('a-scene');
    let mediaItem = media[index];
    let lookImage = document.getElementById('look_1');

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

    // This value can be changed as needed to position the media
    // 0 = straight ahead, 90 = to the right, 180 = behind, 270 = to the left
    const fixedAngleDegrees = 90;  // Adjust as needed
    const radians = fixedAngleDegrees * (Math.PI / 180);  // Convert degrees to radians
    const x = -25 * Math.sin(radians);  // Calculate the x position
    const z = -25 * Math.cos(radians);  // Calculate the z position

    // Correct rotation to always face the user
    // Keeps media upright and oriented correctly relative to the camera
    // 0 degrees of fixedAngleDegrees = 0 degrees of rotationY,
    // 90 degrees of fixedAngleDegrees = 90 degrees of rotationY,
    // 180 degrees of fixedAngleDegrees = 180 degrees of rotationY,
    // 270 degrees of fixedAngleDegrees = 270 degrees of rotationY
    const rotationY = fixedAngleDegrees;  

    entity.setAttribute('position', `${x} 5 ${z}`);
    entity.setAttribute('rotation', `0 ${rotationY} 0`);
    entity.setAttribute('scale', mediaItem.scale);

    scene.appendChild(entity);

    const div = document.querySelector('.instructions');
    div.innerText = mediaItem.info;

    // Set opposite position for the look-around cue
    const oppositeAngleDegrees = (fixedAngleDegrees + 180) % 360;
    const oppositeRadians = oppositeAngleDegrees * (Math.PI / 180);
    const oppositeX = -25 * Math.sin(oppositeRadians);
    const oppositeZ = -25 * Math.cos(oppositeRadians);

    // Adjust rotation to face the camera
    lookImage.setAttribute('position', `${oppositeX} 5 ${oppositeZ}`);
    lookImage.setAttribute('rotation', `0 ${oppositeAngleDegrees} 0`);
    lookImage.setAttribute('visible', 'true');
}
