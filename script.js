import { config } from './config.js';

const galleryElement = document.getElementById('gallery');
const imagesPerLoad = 10;
let page = 1;

const accessKey = config.API_KEY;

const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.8
};

let isLoading = false;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !isLoading) {
            loadImages();
        }
    });
}, options);

async function fetchImages() {
    try {
        const response = await fetch(`https://pixabay.com/api/?key=${accessKey}&q=nature&page=${page}&per_page=${imagesPerLoad}`);
        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
}

function displayImages(images) {
    sentinel.remove();
    
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.webformatURL;
        img.alt = image.tags || 'Pixabay Image';
        galleryElement.appendChild(img);
    });
    
    galleryElement.appendChild(sentinel);
}

async function loadImages() {
    console.log('Loading images...');
    isLoading = true;
    const images = await fetchImages();
    console.log(`Fetched ${images.length} images`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    displayImages(images);
    page++;
    isLoading = false;
}

const sentinel = document.createElement('div');
sentinel.id = 'sentinel';
sentinel.style.height = '20px';
sentinel.style.width = '100%';
galleryElement.appendChild(sentinel);

observer.observe(sentinel);

loadImages();