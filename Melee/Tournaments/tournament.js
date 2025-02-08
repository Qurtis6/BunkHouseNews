Section("", "Final Bracket");
function Section(evt, section) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("container");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("tablinks-active");
  }
  document.getElementById(section).style.display = "block";
  document.getElementById("b-" + section).classList.add("tablinks-active");
  // evt.currentTarget.className += " active";
}

// Get the modal
var modal = document.getElementById("myModal");
// Get the button that opens the modal
var btn = document.getElementsByClassName("item-match");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var modal_p_title = document.getElementById("modal-p-title");
var modal_table = document.getElementById("modal-table");
var modal_video = document.getElementById("modal-video");
// When the user clicks on the button, open the modal
for (i = 0; i < btn.length; i++) {
  (function (index) {
    btn[index].onclick = function () {
      modal.style.display = "block";
      modal_p_title.textContent = btn[index].getAttribute('data-match');
      modal_table.rows[0].cells[0].innerHTML = btn[index].getAttribute('data-p1');
      modal_table.rows[0].cells[1].innerHTML = btn[index].getAttribute('data-p1wins');
      modal_table.rows[0].cells[4].innerHTML = btn[index].getAttribute('data-p2');
      modal_table.rows[0].cells[3].innerHTML = btn[index].getAttribute('data-p2wins');
      modal_video.src = btn[index].getAttribute('data-video');
    };
  })(i)
}
// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
  modal_video.src = "";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modal_video.src = "";
  }
}