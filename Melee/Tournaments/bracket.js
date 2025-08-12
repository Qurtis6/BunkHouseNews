document.addEventListener("DOMContentLoaded", function () {

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
        matchDiv.dataset.p1char = matchData.p1icon[0];
        matchDiv.dataset.p1wins = p1wins;  // Set dynamically calculated wins
        matchDiv.dataset.p2 = matchData.p2;
        matchDiv.dataset.p2char = matchData.p2icon[0];
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

    // Get the JSON file path from the body tag's data-json attribute
    const jsonFilePath = document.body.getAttribute('data-json');

    // Fetch the JSON data from the specified file
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            // Now, we can access the `data` which is the parsed JSON file.

            // Start building the winners bracket
            const winnersBracketElement = buildBracket(data.winners[0]);
            if (winnersBracketElement) {
                document.getElementById("winners").appendChild(winnersBracketElement);
            }

            // Start building the losers bracket
            const losersBracketElement = buildBracket(data.losers[0]);
            if (losersBracketElement) {
                document.getElementById("losers").appendChild(losersBracketElement);
            }

            // Start building PoolA
            const poolAElement = buildBracket(data.poolA[0]);
            if (poolAElement) {
                document.getElementById("poolA").appendChild(poolAElement);
            }

            // Start building PoolB
            const poolBElement = buildBracket(data.poolB[0]);
            if (poolBElement) {
                document.getElementById("poolB").appendChild(poolBElement);
            }

            // Start building PoolC
            const poolCElement = buildBracket(data.poolC[0]);
            if (poolCElement) {
                document.getElementById("poolC").appendChild(poolCElement);
            }

            // Start building PoolD
            const poolDElement = buildBracket(data.poolD[0]);
            if (poolDElement) {
                document.getElementById("poolD").appendChild(poolDElement);
            }

            // Start building PoolE 
            const poolEElement = buildBracket(data.poolE[0]);
            if (poolEElement) {
                document.getElementById("poolE").appendChild(poolEElement);
            }

            // Start building PoolF
            const poolFElement = buildBracket(data.poolF[0]);
            if (poolFElement) {
                document.getElementById("poolF").appendChild(poolFElement);
            }

            // Start building PoolG
            const poolGElement = buildBracket(data.poolG[0]);
            if (poolGElement) {
                document.getElementById("poolG").appendChild(poolGElement);
            }

            // Start building PoolH
            const poolHElement = buildBracket(data.poolH[0]);
            if (poolHElement) {
                document.getElementById("poolH").appendChild(poolHElement);
            }

        })
        .catch(error => console.error("Error loading JSON file:", error));

});
