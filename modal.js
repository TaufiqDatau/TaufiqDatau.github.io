// JavaScript for Carousel
let currentSlide = 0;
let isModalOpen = false;

function updateCarousel() {
    const carousel = document.getElementById('carousel-images');
    const slides = document.querySelectorAll('.carousel-images img');
    const totalSlides = slides.length;

    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    const offset = -currentSlide * 100; // Adjust width percentage
    carousel.style.transform = `translateX(${offset}%)`;
}

function prevSlide() {
    currentSlide -= 1;
    updateCarousel();
}

function nextSlide() {
    currentSlide += 1;
    updateCarousel();
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    currentSlide = 0;
    isModalOpen = false;
}

function openModal(){
    currentSlide =0;
    const overlay= document.getElementById('modal-overlay');
    overlay.style.display = '';
    overlay.scrollTop = 0;
    isModalOpen =true;
}