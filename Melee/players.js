function getQueryName() {
    return decodeURIComponent(window.location.search.substring(1)) || "Unknown";
}

document.addEventListener("DOMContentLoaded", function () {
    const playerName = getQueryName();

    fetch("players.json")
        .then(response => response.json())
        .then(data => {
            const { players, unrankedPlayers } = data;
            const allPlayers = [...players, ...unrankedPlayers];

            // Find the player by name and determine their rank
            const playerIndex = players.findIndex(p => p.name === playerName);
            const player = allPlayers.find(p => p.name === playerName);

            if (!player) {
                console.error("Player not found:", playerName);
                document.getElementById("playerTag").textContent = "Player Not Found";
                return;
            }

            // Parse tag to remove any HTML styling
            const tempElement = document.createElement("div");
            tempElement.innerHTML = player.tag;
            const cleanTag = tempElement.textContent || tempElement.innerText;

            // Update player tag display
            document.getElementById("playerTag").textContent = cleanTag === playerName 
                ? cleanTag 
                : `${cleanTag} (${playerName})`;

            // Update player icon
            const iconElement = document.getElementById("playerChar");
            if (player.icon) {
                iconElement.src = `Images/Classic Poses/Left/${player.icon}.png`;
                iconElement.style.display = "block";
            } else {
                iconElement.style.display = "none";
            }

            // Extract base icon (before the dash)
            let baseIcon = player.icon ? player.icon.split("-")[0] : null;

            // Mapping of specific characters to their respective series
            const iconSeriesMapping = {
                "doc": "mario",
                "luigi": "mario",
                "bowser": "mario",
                "peach": "mario",
                "ganon": "zelda",
                "falco": "fox",
                "link": "zelda",
                "young link": "zelda",
                "pichu": "pikachu",
                "puff": "pikachu",
                "mewtwo": "pikachu",
                "roy": "marth"
            };

            if (baseIcon in iconSeriesMapping) {
                baseIcon = iconSeriesMapping[baseIcon];
            }

            // Update background image
            const backgroundElement = document.getElementById("background");
            if (backgroundElement && baseIcon) {
                backgroundElement.style.backgroundImage = `url('/Melee/Images/Symbols/${baseIcon}.svg')`;
            }

            // Update rank display
            const rankElement = document.getElementById("rank");
            if (playerIndex !== -1) {
                rankElement.textContent = `Rank: ${playerIndex + 1}`;
            } else {
                rankElement.textContent = "Unranked";
            }
        })
        .catch(error => console.error("Error loading players.json:", error));
});
