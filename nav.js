var html =
  '<div class="header-bar">\
<h1>Bunk House News</h1>\
<a href="index.html">\
  <img src="media/bunkhouse-logo.png" class="logo" />\
</a>\
<div class="dropdown">\
  <a class="dropdown-btn">About</a>\
  <div class="dropdown-content">\
    <a href="meet.html">\
      Meet the\
      <br />\
      Bunk House\
    </a>\
    <a href="history.html">History</a>\
    <a href="games.html">Games</a>\
  </div>\
</div>\
<a class="header-btn" href="shop.html">\
  Shop\
</a>\
<a class="header-btn" href="master-kirby.html">\
  Master\
  <br />\
  Kirby\
</a>\
</div>';

var hamburger =
  '<h1>Bunk House News</h1>\
  <a href="index.html">\
  <img src="media/bunkhouse-logo.png" class="logo" />\
</a>\
    <div class="off-screen-menu">\
      <ul>\
        <li><a href="meet.html">Meet the <br >Bunk House</a></li>\
        <li><a href="history.html">History</a></li>\
        <li><a href="shop.html">Shop</a></li>\
        <li><a href="games.html">Games</a></li>\
        <li><a href="master-kirby.html">Master<br >Kirby</a></li>\
      </ul>\
    </div>\
    <nav>\
      <div class="ham-menu">\
        <span></span>\
        <span></span>\
        <span></span>\
      </div>\
    </nav>';

const mediaQuery = window.matchMedia("(max-width: 768px)");
if (mediaQuery.matches) {
  document.getElementById("nav").innerHTML = hamburger;
  const hamMenu = document.querySelector(".ham-menu");

  const offScreenMenu = document.querySelector(".off-screen-menu");

  hamMenu.addEventListener("click", () => {
    hamMenu.classList.toggle("active");
    offScreenMenu.classList.toggle("active");
  });
} else {
  document.getElementById("nav").innerHTML = html;
}
