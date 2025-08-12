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

    var sectionElement = document.getElementById(section);
    if (sectionElement) {
        sectionElement.style.display = "block";
    } else {
        console.error(`Section "${section}" not found in the DOM.`);
    }

    var buttonElement = document.getElementById("b-" + section);
    
    // ✅ Only modify button if it exists
    if (buttonElement) {
        buttonElement.classList.add("tablinks-active");
    }
}


// Update the modal event listener to check for all the relevant match containers
document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    var modal_p_title = document.getElementById("modal-p-title");
    var modal_table = document.getElementById("modal-table");
    var modal_video = document.getElementById("modal-video");
    var modal_p1char = document.getElementById("char-left");
    var modal_p2char = document.getElementById("char-right");

    // Select all match containers including the winners, losers, and pools
    var allMatchContainers = document.querySelectorAll("#winners, #losers, #poolA, #poolB, #poolC, #poolD, #poolE, #poolF, #poolG, #poolH, #player-bracket");

    // Event delegation: Listen for clicks on .item-match within these containers
    allMatchContainers.forEach(function(container) {
        container.addEventListener("click", function(event) {
            if (event.target.closest(".item-match")) {
                var btn = event.target.closest(".item-match");

                var videoSrc = btn.getAttribute('data-video');

                modal.style.display = "block";
                modal_p_title.textContent = btn.getAttribute('data-match');
                modal_table.rows[0].cells[0].innerHTML = btn.getAttribute('data-p1');
                modal_table.rows[0].cells[1].innerHTML = btn.getAttribute('data-p1wins');
                modal_table.rows[0].cells[4].innerHTML = btn.getAttribute('data-p2');
                modal_table.rows[0].cells[3].innerHTML = btn.getAttribute('data-p2wins');
                if (!videoSrc || videoSrc.trim() === "") {
                    // No video, so set images
                    modal_p1char.src = `../Images/Classic Poses/Left/${btn.getAttribute('data-p1char')}.png`;
                    modal_p2char.src = `../Images/Classic Poses/Right/${btn.getAttribute('data-p2char')}.png`;
                } else {
                    // We have a video, so set the video element's src instead
                    modal_video.src = videoSrc;
                }            
            }
        });
    });

    function closeModal() {
        modal.style.display = "none";
        modal_video.src = "";
        modal_p1char.src = "";
        modal_p2char.src = "";
    }

    // When the user clicks on <span> (x)
    span.onclick = closeModal;

    // When the user clicks anywhere outside the modal
    window.onclick = function (event) {
        if (event.target === modal) {
            closeModal();
        }
    };

});
