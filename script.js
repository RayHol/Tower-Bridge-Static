window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '<>';
    button.addEventListener('click', changeMedia); // Add event listener for changing media

    // Wait for the a-scene to fully load before displaying the media
    document.querySelector('a-scene').addEventListener('loaded', function () {
        displayMedia(modelIndex); // This function places the media in the scene
    });
};

var media = [
    {
        type: 'image',
        url: './assets/Image 1.jpg', // Ensure the file name matches exactly, including case sensitivity
        scale: '12 9 1', // Adjust scale as needed
        rotation: '0 90 0', // Adjust rotation as needed
        info: 'Image description here',
    },
    {
        type: 'video',
        url: './assets/Video1.mp4', // Ensure the file name matches exactly, including case sensitivity
        scale: '12 9 1', // Adjust scale as needed
        rotation: '0 90 0', // Adjust rotation as needed
        info: 'Video description here',
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

    // Remove any existing media before adding new
    let existingMedia = scene.querySelector('a-image, a-video');
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
}




