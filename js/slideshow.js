// SLIDESHOW LOGIC (ACTIVATES WHEN IMAGES ARE LOCAL)

const images = [
  "images/gallery/placeholder.jpg"
  // Later add:
  // "images/gallery/crane1.jpg",
  // "images/gallery/plc1.jpg"
];

let index = 0;

setInterval(() => {
  if (images.length > 1) {
    index = (index + 1) % images.length;
    document.getElementById("slide").src = images[index];
  }
}, 3000);
