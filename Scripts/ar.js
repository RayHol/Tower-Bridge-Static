window.onload = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const locationId = urlParams.get('location');
    if (!locationId) {
        console.error('No location specified in URL');
        return;
    }

    fetch('./Scripts/mediaConfig.json')
        .then(response => response.json())
        .then(data => {
            if (!data[locationId]) {
                console.error('Invalid location specified');
                return;
            }
            initializeAR(data[locationId].media);
        })
        .catch(error => console.error('Error loading media config:', error));
};

function initializeAR(mediaArray) {
    let modelIndex = 0;

    function setMediaSource() {
        const lookImage = document.getElementById('look_1');
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('iphone')) {
            lookImage.setAttribute('src', './assets/lookImage.png');
            lookImage.setAttribute('material', 'transparent: true; alphaTest: 0.5;');
        } else {
            lookImage.setAttribute('src', './assets/lookImage.png');
        }
    }

    function changeMedia() {
        modelIndex = (modelIndex + 1) % mediaArray.length;
        displayMedia(modelIndex);
    }

    function displayMedia(index) {
        let scene = document.querySelector('a-scene');
        let mediaItem = mediaArray[index];
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

        // Use the fixedAngleDegrees from the configuration
        const fixedAngleDegrees = mediaItem.fixedAngleDegrees; 
        const radians = fixedAngleDegrees * (Math.PI / 180);
        const x = -25 * Math.sin(radians);
        const z = -25 * Math.cos(radians);

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

        lookImage.setAttribute('position', `${oppositeX} 5 ${oppositeZ}`);
        lookImage.setAttribute('rotation', `0 ${oppositeAngleDegrees} 0`);
        lookImage.setAttribute('visible', 'true');
    }

    setMediaSource();
    const button = document.querySelector('button[data-action="change"]');
    button.addEventListener('click', changeMedia);

    const scene = document.querySelector('a-scene');
    if (scene.hasLoaded) {
        displayMedia(modelIndex); // Initial media display
    } else {
        scene.addEventListener('loaded', function () {
            displayMedia(modelIndex); // Initial media display
        });
    }
}
