document.addEventListener("DOMContentLoaded", function () {
    const players = [
        { name: "Gouda", icon: "fox.png", link: "players/preston.html" },
        { name: "Mozy", icon: "falco-red.png", link: "players/caleb.html" },
        { name: "OP", icon: "doc-red.png", link: "players/onyx.html" },
        { name: '<span style="font-size: 12pt">ジャコブ</span>', icon: "puff-green.png", link: "players/jacob.html" },
        { name: "Master Kirby", icon: "kirby-blue.png" },
        { name: "K0DU", icon: "falco-green.png" },
        { name: "BoB%", icon: "samus.png" },
        { name: "Orange", icon: "sheik-green.png" },
        { name: "GAN", icon: "ganon.png" },
        { name: "Adam", icon: "luigi.png" },
        { name: "9QG", icon: "falco-blue.png" },
        { name: "Haven", icon: "young link-blue.png" },
        { name: "Bry", icon: "samus-blue.png" },
        { name: "Carrie", icon: "kirby.png" },
        { name: "Rachel", icon: "luigi.png" },
        { name: "Gracie", icon: "sheik-green.png" },
        { name: "Carsten", icon: "samus-blue.png" },
        { name: "Mary Grace", icon: "link-white.png" },
        { name: "Alayna", icon: "link-white.png" },
        { name: "ME", icon: "link-black.png" },
        { name: "Jayleigh", icon: "peach-white.png" },
        { name: "Addi", icon: "kirby-red.png" },
        { name: "Chaitan", icon: "link.png" },
        { name: "Jada", icon: "peach.png" },
        { name: "Jason", icon: "marth.png" },
        { name: "Ellie", icon: "link-blue.png" },
        { name: "Piper", icon: "kirby-yellow.png" },
        { name: "Katy", icon: "sheik-white.png" },
        { name: "Mere", icon: "fox-green.png" },
    ];

    const unrankedPlayers = ["Noodle", "Geoffrey", "Dixie", "Tracy"];

    function createPlayerList(players, containerId, isRanked = true) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with ID '${containerId}' not found.`);
            return;
        }

        players.forEach((player, index) => {
            const a = document.createElement("a");
            a.href = player.link || "#";
            a.innerHTML = `<p class="link">${isRanked ? (index + 1) + ") " : ""}${player.name} 
                ${player.icon ? `<img class="icon" src="icons/${player.icon}">` : ""}
            </p>`;
            container.appendChild(a);
        });
    }

    // Create ranked and unranked lists
    createPlayerList(players, "playerList", true);
    createPlayerList(unrankedPlayers.map(name => ({ name })), "unrankedList", false);
});
