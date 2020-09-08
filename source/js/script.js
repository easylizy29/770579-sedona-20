var menuBtn = document.querySelector(".page-header__menu-button");

var menu = document.querySelector(".site-list");
var closeMenu = document.querySelector(".main-nav__close");

menuBtn.addEventListener("click", function(evt) {
  evt.preventDefault();
  menu.classList.add("site-list--show");
  menuBtn.classList.add("page-header__menu-button--hide")
});

closeMenu.addEventListener("click", function(evt) {
  evt.preventDefault();
  menu.classList.remove("site-list--show");
  menuBtn.classList.remove("page-header__menu-button--hide")
});

window.addEventListener("keydown", function(evt) {
  if (evt.keyCode === 27) {
    if (menu.classList.contains("site-list--show")) {
      menu.classList.remove("site-list--show");
      menuBtn.classList.remove("page-header__menu-button--hide")
    }
  }
});
