let togglecont = document.querySelector(".toggle");
let openToggle = document.querySelector(".open-toggle");
let closeToggle = document.querySelector(".close-toggle");

openToggle.onclick = function () {
  togglecont.style.display = "block";
  closeToggle.style.display = "block";
  openToggle.style.display = "none";
};
closeToggle.onclick = function () {
  togglecont.style.display = "none";
  closeToggle.style.display = "none";
  openToggle.style.display = "block";
};
