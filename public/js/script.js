const navbar = document.getElementsByTagName("nav")[0];

window.addEventListener("scroll", function () {
  if (window.scrollY != 0) {
    navbar.classList.add("nav-color");
  }
  if (window.scrollY == 0) {
    navbar.classList.remove("nav-color");
  }
});
