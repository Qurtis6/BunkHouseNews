document.addEventListener("DOMContentLoaded", function () {
    fetch("players.json")
        .then(response => response.json())
        .then(data => {
            const { players, unrankedPlayers } = data;

            function createPlayerList(players, containerId, isRanked = true) {
                const container = document.getElementById(containerId);
                if (!container) {
                    console.error(`Container with ID '${containerId}' not found.`);
                    return;
                }

                players.forEach((player, index) => {
                    const a = document.createElement("a");
                    a.href = `players.html?${encodeURIComponent(player.name)}`;
                    a.innerHTML = `<p class="link">${isRanked ? (index + 1) + ") " : ""}${player.tag} 
                        ${player.icon ? `<img class="icon" src="icons/${player.icon}.png">` : ""}
                    </p>`;
                    container.appendChild(a);
                });
            }

            createPlayerList(players, "playerList", true);
            createPlayerList(unrankedPlayers.map(player => ({ ...player, icon: "" })), "unrankedList", false);
        })
        .catch(error => console.error("Error loading players.json:", error));
});
