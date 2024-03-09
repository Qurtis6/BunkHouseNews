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

document.getElementById("nav").innerHTML = html;
