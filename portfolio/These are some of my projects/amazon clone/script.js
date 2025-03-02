// Select the horizontal items containers
const slider1 = document.querySelector(".horizontal-items1");
const slider2 = document.querySelector(".horizontal-items2");
const slider3 = document.querySelector(".horizontal-items3");
const slider4 = document.querySelector(".horizontal-items4");

function scrollLeft(slider) {
  slider.scrollBy({ left: -200, behavior: "smooth" });
}

function scrollRight(slider) {
  slider.scrollBy({ left: 200, behavior: "smooth" });
}
