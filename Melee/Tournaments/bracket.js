document.addEventListener("DOMContentLoaded", function () {
    const tournamentData = {
        winners: [
            {
                match: "Grand Final Reset",
                p1: "Mozy",
                p1icon: ["falco-red"],
                p2: "Gouda",
                p2icon: ["yoshi-cyan"],
                gameResults: [0, 1, 1, 1],
                video: "",
                children: [
                    {
                        match: "Grand Final",
                        p1: "Mozy",
                        p1icon: ["falco-red"],
                        p2: "Gouda",
                        p2icon: ["yoshi-cyan"],
                        gameResults: [0, 0, 1, 0],
                        video: "",
                        children: [
                            {
                                match: "Winners Final",
                                p1: "Gouda",
                                p1icon: ["yoshi-cyan"],
                                p2: "Mozy",
                                p2icon: ["falco-red"],
                                gameResults: [0, 1, 0, 0],
                                video: "",
                                children: [
                                    {
                                        match: "Winners Semi-Final",
                                        p1: "Gouda",
                                        p1icon: ["yoshi-cyan"],
                                        p2: "K0DU",
                                        p2icon: ["falco-green"],
                                        gameResults: [0, 1, 1, 1],
                                        video: "",
                                        children: [
                                            {
                                                match: "Winners Quarter-Final",
                                                p1: "Gouda",
                                                p1icon: ["yoshi-cyan"],
                                                p2: "Carrie",
                                                p2icon: ["kirby"],
                                                gameResults: [1, 1],
                                                video: "",
                                                children: []
                                            },
                                            {
                                                match: "Winners Quarter-Final",
                                                p1: "K0DU",
                                                p1icon: ["falco-green"],
                                                p2: "Orange",
                                                p2icon: ["sheik-green"],
                                                gameResults: [1, 0, 1],
                                                video: "",
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        match: "Winners Final",
                                        p1: "Jaco",
                                        p1icon: ["puff-green"],
                                        p2: "Mozy",
                                        p2icon: ["falco-red"],
                                        gameResults: [0, 0, 0],
                                        video: "",
                                        children: [
                                            {
                                                match: "Winners Quarter-Final",
                                                p1: "Jaco",
                                                p1icon: ["mario"],
                                                p2: "Gan",
                                                p2icon: ["ganon"],
                                                gameResults: [1, 1],
                                                video: "",
                                                children: []
                                            },
                                            {
                                                match: "Winners Quarter-Final",
                                                p1: "Mozy",
                                                p1icon: ["falco-red"],
                                                p2: "9QG",
                                                p2icon: ["falco-blue"],
                                                gameResults: [1, 1],
                                                video: "",
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        losers: [
            {
                match: "Losers Final",
                p1: "Gouda",
                p1icon: ["yoshi-cyan"],
                p2: "K0DU",
                p2icon: ["falco-green"],
                gameResults: [1, 0, 1, 0, 1],
                video: "",
                children: [
                    {
                        match: "Losers Semi-Final",
                        p1: "Orange",
                        p1icon: ["sheik-green"],
                        p2: "K0DU",
                        p2icon: ["falco-green"],
                        gameResults: [1, 0, 0, 0],
                        video: "",
                        children: [
                            {
                                match: "Losers Quarter-Final",
                                p1: "Orange",
                                p1icon: ["sheik-green"],
                                p2: "Jaco",
                                p2icon: ["bowser-black"],
                                gameResults: [0, 0, 1, 1, 1],
                                video: "",
                                children: [
                                    {
                                        match: "Losers Eighths",
                                        p1: "Bry",
                                        p1icon: ["samus","sheik","zelda"],
                                        p2: "Orange",
                                        p2icon: ["sheik-green","luigi"],
                                        gameResults: [0, 0, 0],
                                        video: "",
                                        children: [
                                            {
                                                match: "Round 1",
                                                p1: "Bry",
                                                p1icon: ["sheik"],
                                                p2: "Carrie",
                                                p2icon: ["kirby"],
                                                gameResults: [0, 0],
                                                video: "",
                                                children: []
                                            },
                                            {
                                                match: "Round 1",
                                                p1: "Gracie",
                                                p1icon: ["sheik-red","sheik-white"],
                                                p2: "Orange",
                                                p2icon: ["sheik-green","luigi"],
                                                gameResults: [0, 0],
                                                video: "",
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                match: "Losers Semi-Final",
                                p1: "Gan",
                                p1icon: ["ganon"],
                                p2: "K0DU",
                                p2icon: ["falco-green","falco-green","g&w","g&w"],
                                gameResults: [0, 0, 1, 0],
                                video: "",
                                children: [
                                    {
                                        match: "Losers Eighths",
                                        p1: "Gan",
                                        p1icon: ["ganon"],
                                        p2: "Haven",
                                        p2icon: ["marth","marth","young link-blue"],
                                        gameResults: [1, 1, 1],
                                        video: "",
                                        children: [
                                            {
                                                match: "Round 1",
                                                p1: "Carsten",
                                                p1icon: ["roy-yellow","samus-blue"],
                                                p2: "Gan",
                                                p2icon: ["ganon"],
                                                gameResults: [0, 0],
                                                video: "",
                                                children: []
                                            },
                                            {
                                                match: "Round 1",
                                                p1: "Haven",
                                                p1icon: ["young link-blue"],
                                                p2: "9QG",
                                                p2icon: ["samus-blue","samus-blue","falco"],
                                                gameResults: [0, 1, 1],
                                                video: "",
                                                children: []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        poolA: [
            {
                match: "PoolA Match 1",
                p1: "Rachel",
                p1icon: ["luigi"],
                p2: "Carrie",
                p2icon: ["kirby"],
                gameResults: [1, 0, 0],
                video: "",
                children: [
                    {
                        match: "PoolA Match 1",
                        p1: "Jayleigh",
                        p1icon: ["peach-white"],
                        p2: "Rachel",
                        p2icon: ["luigi"],
                        gameResults: [0, 0],
                        video: "",
                        children: [
                            {
                                match: "PoolA Match 1",
                                p1: "Chaiten",
                                p1icon: ["link-white"],
                                p2: "Jayleigh",
                                p2icon: ["peach-white"],
                                gameResults: [1, 0, 0],
                                video: "",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ],
        poolB: [
            {
                match: "PoolB Match 1",
                p1: "Carsten",
                p1icon: ["samus-blue"],
                p2: "Orange",
                p2icon: ["sheik-green"],
                gameResults: [0, 0],
                video: "",
                children: [
                    {
                        match: "PoolB Match 1",
                        p1: "Carsten",
                        p1icon: ["samus-blue","roy"],
                        p2: "Justus",
                        p2icon: ["link-black","kirby-white"],
                        gameResults: [1, 1],
                        video: "",
                        children: [
                            {
                                match: "PoolB Match 1",
                                p1: "Carsten",
                                p1icon: ["samus-blue"],
                                p2: "Addi",
                                p2icon: ["kirby-blue"],
                                gameResults: [1, 1],
                                video: "",
                                children: [
                                    {
                                        match: "PoolB Match 1",
                                        p1: "Carsten",
                                        p1icon: ["samus-blue"],
                                        p2: "Mary Grace",
                                        p2icon: ["link","link-white"],
                                        gameResults: [1, 1],
                                        video: "",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        poolC: [
            {
                match: "PoolC Match 1",
                p1: "Gracie",
                p1icon: ["sheik-white"],
                p2: "Gan",
                p2icon: ["ganon"],
                gameResults: [0, 0],
                video: "",
                children: [
                    {
                        match: "PoolC Match 1",
                        p1: "Gracie",
                        p1icon: ["marth-white"],
                        p2: "Alayna",
                        p2icon: ["link-blue"],
                        gameResults: [1, 1],
                        video: "",
                        children: [
                            {
                                match: "PoolC Match 1",
                                p1: "Eva",
                                p1icon: ["kirby"],
                                p2: "Gracie",
                                p2icon: ["samus-blue","falcon"],
                                gameResults: [0, 0],
                                video: "",
                                children: [
                                    {
                                        match: "PoolC Match 1",
                                        p1: "Eva",
                                        p1icon: ["kirby"],
                                        p2: "Jada",
                                        p2icon: ["peach"],
                                        gameResults: [1, 1],
                                        video: "",
                                        children: []
                                    },
                                    {
                                        match: "PoolC Match 1",
                                        p1: "Gracie",
                                        p1icon: ["sheik-green","marth-white"],
                                        p2: "Mere",
                                        p2icon: ["fox-green","falco-green"],
                                        gameResults: [1, 1],
                                        video: "",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        poolD: [
            {
                match: "PoolD Match 1",
                p1: "9QG",
                p1icon: ["falco-blue","samus-blue","falco-blue"],
                p2: "Bry",
                p2icon: ["sheik"],
                gameResults: [1, 0, 1],
                video: "",
                children: [
                    {
                        match: "PoolD Match 1",
                        p1: "Haven",
                        p1icon: ["young link-blue","kirby-white"],
                        p2: "9QG",
                        p2icon: ["falco-blue","falco-green"],
                        gameResults: [0, 1, 0],
                        video: "",
                        children: [
                            {
                                match: "PoolD Match 1",
                                p1: "Ellie",
                                p1icon: ["link-blue","kirby-green"],
                                p2: "Haven",
                                p2icon: ["kirby-white","young link-blue"],
                                gameResults: [0, 0],
                                video: "",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ],
        poolE: [
            {
                match: "PoolD Match 1",
                p1: "Bry",
                p1icon: ["sheik","sheik","samus-blue"],
                p2: "M. Grace",
                p2icon: ["link-black","link-black","link-white"],
                gameResults: [1, 0, 1],
                video: "",
                children: [
                    {
                        match: "PoolD Match 1",
                        p1: "Mary Grace",
                        p1icon: [""],
                        p2: "Jayleigh",
                        p2icon: [""],
                        gameResults: [1],
                        video: "",
                        children: [
                            {
                                match: "PoolD Match 1",
                                p1: "M. Grace",
                                p1icon: ["link-white"],
                                p2: "Eva",
                                p2icon: ["kirby"],
                                gameResults: [0, 1, 1],
                                video: "",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ],
        poolF: [
            {
                match: "PoolD Match 1",
                p1: "Gracie",
                p1icon: ["marth-white"],
                p2: "Justus",
                p2icon: ["link-black", "kirby-white"],
                gameResults: [1, 1],
                video: "",
                children: [
                    {
                        match: "PoolD Match 1",
                        p1: "Chaitan",
                        p1icon: ["link-white"],
                        p2: "Justus",
                        p2icon: ["link-black", "kirby-white"],
                        gameResults: [0, 0],
                        video: "",
                        children: [
                            {
                                match: "PoolD Match 1",
                                p1: "Chaitan",
                                p1icon: ["link-white"],
                                p2: "Jada",
                                p2icon: ["peach-daisy"],
                                gameResults: [1, 1],
                                video: "",
                                children: []
                            }
                        ]
                    }
                ]
            }
        ],
        poolG: [
            {
                match: "PoolD Match 1",
                p1: "Carsten",
                p1icon: ["samus-blue"],
                p2: "Ellie",
                p2icon: ["link-blue"],
                gameResults: [1, 1],
                video: "",
                children: [
                    {
                        match: "PoolD Match 1",
                        p1: "Ellie",
                        p1icon: [""],
                        p2: "Alayna",
                        p2icon: [""],
                        gameResults: [1],
                        video: "",
                        children: []
                    }
                ]
            }
        ],
        poolH: [
            {
                match: "PoolD Match 1",
                p1: "Rachel",
                p1icon: ["luigi"],
                p2: "Haven",
                p2icon: ["young link-blue"],
                gameResults: [1, 0, 0],
                video: "",
                children: [
                    {
                        match: "PoolD Match 1",
                        p1: "Addi",
                        p1icon: ["kirby-green","kirby-red"],
                        p2: "Haven",
                        p2icon: ["young link-blue"],
                        gameResults: [0, 0],
                        video: "",
                        children:   [
                            {
                                match: "PoolD Match 1",
                                p1: "Mere",
                                p1icon: ["mewtwo","samus"],
                                p2: "Addi",
                                p2icon: ["kirby-red","kirby"],
                                gameResults: [0, 0],
                                video: "",
                                children:   []
                            }
                        ]
                    }
                ]
            }
        ],
    };

    // Helper function to calculate wins from gameResults array
    function calculateWins(gameResults, player) {
        return gameResults.filter(result => (player === 'p1' && result === 1) || (player === 'p2' && result === 0)).length;
    }

    // Function to create the stock icons for the results
    function createStockIcons(gameResults, playerIconArray, isP1) {
        const container = document.createElement("td");
        container.setAttribute("align", "right");

        gameResults.forEach((result, index) => {
            const img = document.createElement("img");

            const icon = Array.isArray(playerIconArray) ? playerIconArray[Math.min(index, playerIconArray.length - 1)] : playerIconArray[0];
            img.src = `../icons/${icon}.png`;

            if ((isP1 && result === 1) || (!isP1 && result === 0)) {
                img.classList.add("icon"); // Win
            } else {
                img.classList.add("icon-loss"); // Loss
            }

            container.appendChild(img);
        });

        return container;
    }

    // Function to create the match element
    function createMatchElement(matchData) {
        if (!matchData || !matchData.match || !matchData.p1 || !matchData.p2 || !Array.isArray(matchData.gameResults)) {
            console.error("Invalid match data:", matchData);
            return null;
        }

        // Calculate wins dynamically
        const p1wins = calculateWins(matchData.gameResults, 'p1');
        const p2wins = calculateWins(matchData.gameResults, 'p2');

        const matchDiv = document.createElement("div");
        if (((p1wins || p2wins) == 3) || matchData.gameResults.length > 3){
            matchDiv.classList.add("item-match", "bo5");
        }
        else {
            matchDiv.classList.add("item-match", "bo3");
        }
        matchDiv.dataset.match = matchData.match;
        matchDiv.dataset.p1 = matchData.p1;
        matchDiv.dataset.p1wins = p1wins;  // Set dynamically calculated wins
        matchDiv.dataset.p2 = matchData.p2;
        matchDiv.dataset.p2wins = p2wins;  // Set dynamically calculated wins
        matchDiv.dataset.video = matchData.video;

        const table = document.createElement("table");
        const tbody = document.createElement("tbody");

        // Player 1 Row
        const p1Row = document.createElement("tr");
        p1Row.classList.add("underline");
        const p1Name = document.createElement("td");
        p1Name.textContent = matchData.p1;
        p1Row.appendChild(p1Name);
        p1Row.appendChild(createStockIcons(matchData.gameResults, matchData.p1icon, true));

        // Player 2 Row
        const p2Row = document.createElement("tr");
        const p2Name = document.createElement("td");
        p2Name.textContent = matchData.p2;
        p2Row.appendChild(p2Name);
        p2Row.appendChild(createStockIcons(matchData.gameResults, matchData.p2icon, false));

        tbody.appendChild(p1Row);
        tbody.appendChild(p2Row);
        table.appendChild(tbody);
        matchDiv.appendChild(table);

        return matchDiv;
    }

    // Recursive function to build the bracket
    function buildBracket(matchData) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");

        function createMatchTree(matchData) {
            const item = document.createElement("div");
            item.classList.add("item");

            const matchElement = createMatchElement(matchData);
            if (matchElement) {
                if (matchData.children && matchData.children.length > 0) {
                    const parentDiv = document.createElement("div");
                    parentDiv.classList.add("item-parent");
                    parentDiv.appendChild(matchElement);
                    item.appendChild(parentDiv);
                } else {
                    item.appendChild(matchElement); // If no children, add match directly
                }
            }

            if (matchData.children && matchData.children.length > 0) {
                const childrenContainer = document.createElement("div");
                childrenContainer.classList.add("item-childrens");

                matchData.children.forEach((child) => {
                    const childDiv = document.createElement("div");
                    childDiv.classList.add("item-child");
                    const childElement = createMatchTree(child);
                    if (childElement) {
                        childDiv.appendChild(childElement);
                        childrenContainer.appendChild(childDiv);
                    }
                });

                item.appendChild(childrenContainer);
            }

            return item;
        }

        wrapper.appendChild(createMatchTree(matchData));
        return wrapper;
    }

    // Start building the winners bracket
    const winnersBracketElement = buildBracket(tournamentData.winners[0]);
    if (winnersBracketElement) {
        document.getElementById("winnersTop8").appendChild(winnersBracketElement);
    }

    // Start building the losers bracket
    const losersBracketElement = buildBracket(tournamentData.losers[0]);
    if (losersBracketElement) {
        document.getElementById("losersTop8").appendChild(losersBracketElement);
    }

    // Start building PoolA
    const poolAElement = buildBracket(tournamentData.poolA[0]);
    if (poolAElement) {
        document.getElementById("poolA").appendChild(poolAElement);
    }

    // Start building PoolB
    const poolBElement = buildBracket(tournamentData.poolB[0]);
    if (poolBElement) {
        document.getElementById("poolB").appendChild(poolBElement);
    }

    // Start building PoolC
    const poolCElement = buildBracket(tournamentData.poolC[0]);
    if (poolCElement) {
        document.getElementById("poolC").appendChild(poolCElement);
    }

    // Start building PoolD
    const poolDElement = buildBracket(tournamentData.poolD[0]);
    if (poolDElement) {
        document.getElementById("poolD").appendChild(poolDElement);
    }

    // Start building PoolE 
    const poolEElement = buildBracket(tournamentData.poolE[0]);
    if (poolEElement) {
        document.getElementById("poolE").appendChild(poolEElement);
    }
        
    // Start building PoolF
    const poolFElement = buildBracket(tournamentData.poolF[0]);
    if (poolFElement) {
        document.getElementById("poolF").appendChild(poolFElement);
    }
        
    // Start building PoolG
    const poolGElement = buildBracket(tournamentData.poolG[0]);
    if (poolGElement) {
        document.getElementById("poolG").appendChild(poolGElement);
    }
        
    // Start building PoolH
    const poolHElement = buildBracket(tournamentData.poolH[0]);
    if (poolHElement) {
        document.getElementById("poolH").appendChild(poolHElement);
    }

});
