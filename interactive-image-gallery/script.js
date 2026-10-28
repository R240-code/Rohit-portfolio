
// Get all gallery images
const images = document.querySelectorAll(".gallery img");

// Get lightbox elements
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

// Track the currently selected image
let currentIndex = 0;

// Open the lightbox
function openLightbox(index) {

    currentIndex = index;

    lightboxImg.src = images[currentIndex].src;
    lightboxImg.alt = images[currentIndex].alt;

    lightbox.classList.add("active");
}

// Display the next image
function showNextImage() {

    currentIndex++;

    if (currentIndex >= images.length) {
        currentIndex = 0;
    }

    openLightbox(currentIndex);
}

// Display the previous image
function showPreviousImage() {

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = images.length - 1;
    }

    openLightbox(currentIndex);
}

// Add click events to gallery images
images.forEach((image, index) => {

    image.addEventListener("click", function () {

        openLightbox(index);

    });

});

// Close the lightbox
closeBtn.addEventListener("click", function () {

    lightbox.classList.remove("active");

});

// Next image button
nextBtn.addEventListener("click", function () {

    showNextImage();

});

// Previous image button
prevBtn.addEventListener("click", function () {

    showPreviousImage();

});

// Close when clicking the dark background
lightbox.addEventListener("click", function (event) {

    if (event.target === lightbox) {
        lightbox.classList.remove("active");
    }

});

// Keyboard controls
document.addEventListener("keydown", function (event) {

    if (!lightbox.classList.contains("active")) {
        return;
    }

    if (event.key === "Escape") {
        lightbox.classList.remove("active");
    }

    if (event.key === "ArrowRight") {
        showNextImage();
    }

    if (event.key === "ArrowLeft") {
        showPreviousImage();
    }

});

