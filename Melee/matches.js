document.addEventListener("DOMContentLoaded", async function () {
    // Get the full query string from the URL
    const urlParams = window.location.search.substring(1); // Removes the "?" at the start

    // The player name should be the first (and only) parameter
    const playerName = decodeURIComponent(urlParams);

    if (!playerName) {
        console.error("No player specified in URL.");
    } else {
        console.log(`Player page loaded for: ${playerName}`);
    }

    const dataFolder = "/Melee/Tournaments/data/";
    const jsonFiles = ["2015.json", "2016.json", "2018.json", "2021.json", "2022.json", "2023.json", "2024.json"]; // Add all your files here

    let playerMatches = [];

    async function fetchJSON(file) {
        try {
            const response = await fetch(dataFolder + file);
            if (!response.ok) throw new Error(`Failed to load ${file} - HTTP ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error("Error fetching JSON:", file, error);
            return null;
        }
    }

    async function loadAndFilterMatches() {
        playerMatches = [];
    
        for (const file of jsonFiles) {
            const data = await fetchJSON(file);
            if (data) {
                let winnersMatches = extractPlayerMatches(data.winners, playerName);
                let losersMatches = extractPlayerMatches(data.losers, playerName);
                //let poolMatches = extractPlayerMatches(data.PoolA, playerName);
    
                // Extract Grand Finals and Grand Final Reset
                let grandFinalReset = winnersMatches.find(match => match.match === "Grand Final Reset");
                let grandFinal = winnersMatches.find(match => match.match === "Grand Finals");
    
                // Remove them from the winners list
                winnersMatches = winnersMatches.filter(match => 
                    match.match !== "Grand Finals" && match.match !== "Grand Final Reset"
                );
    
                if (losersMatches.length > 0) {
                    let lastLosersMatch = findLastMatch(losersMatches);
    
                    // Attach winners bracket to the last match of the losers bracket
                    lastLosersMatch.children.push(...winnersMatches);
                    
                    // Attach the full losers bracket to Grand Finals
                    if (grandFinal) {
                        grandFinal.children.push(...losersMatches);
                    }
                } else if (grandFinal) {
                    // If no losers bracket, just add winners to Grand Finals
                    grandFinal.children.push(...winnersMatches);
                }
    
                // Ensure Grand Final Reset (if exists) is the root node
                let finalBracket = grandFinalReset ? [grandFinalReset] : [];
                if (grandFinal) finalBracket.push(grandFinal);
    
                if (finalBracket.length > 0) {
                    playerMatches.push({ year: file.replace(".json", ""), matches: finalBracket });
                } else if ((winnersMatches.length > 0)){
                    playerMatches.push({ year: file.replace(".json", ""), matches: losersMatches.length > 0 ? losersMatches : winnersMatches });
                }
            }
        }
    
        displayBracket();
    }

// Usage inside loadAndFilterMatches()
    function findLastMatch(matches) {
        if (!matches || matches.length === 0) return null;
    
        let lastMatch = matches[matches.length - 1];
    
        while (lastMatch.children && lastMatch.children.length > 0) {
            lastMatch = lastMatch.children[lastMatch.children.length - 1];
        }
    
        return lastMatch;
    }

    function extractPlayerMatches(matches, player) {
        if (!matches) return [];
    
        let filteredMatches = [];
    
        matches.forEach(match => {
            let playerInMatch = match.p1 === player || match.p2 === player;
            let childMatches = extractPlayerMatches(match.children, player);
    
            if (playerInMatch) {
                // Keep the match and only include relevant children
                let matchCopy = { ...match, children: childMatches };
                filteredMatches.push(matchCopy);
            } else if (childMatches.length > 0) {
                // If the player is in child matches but not this match, keep only the children
                filteredMatches.push(...childMatches);
            }
        });
    
        return filteredMatches;
    }
    
    function calculateWins(gameResults, player, p1, p2) {
        return gameResults.filter(result => {
            return (player === p1 && result === 1) || (player === p2 && result === 0);
        }).length;
    }

    function createStockIcons(gameResults, playerIconArray, isP1) {
        const container = document.createElement("td");
        container.setAttribute("align", "right");

        if (!Array.isArray(playerIconArray) || playerIconArray.length === 0) {
            console.warn("Missing icons for player:", playerIconArray);
            return container;
        }

        gameResults.forEach((result, index) => {
            const img = document.createElement("img");
            const icon = playerIconArray[Math.min(index, playerIconArray.length - 1)] || "default-icon";
            img.src = `/Melee/icons/${icon}.png`;

            img.classList.add(result === (isP1 ? 1 : 0) ? "icon" : "icon-loss");
            container.appendChild(img);
        });

        return container;
    }

    function createMatchElement(matchData) {
        if (!matchData || !matchData.match || !matchData.p1 || !matchData.p2 || !Array.isArray(matchData.gameResults)) {
            console.error("Invalid match data:", matchData);
            return null;
        }

        const p1wins = calculateWins(matchData.gameResults, matchData.p1, matchData.p1, matchData.p2);
        const p2wins = calculateWins(matchData.gameResults, matchData.p2, matchData.p1, matchData.p2);

        const matchDiv = document.createElement("div");
        if ((p1wins === 3 || p2wins === 3) || matchData.gameResults.length > 3) {
            matchDiv.classList.add("item-match", "bo5");
        } else {
            matchDiv.classList.add("item-match", "bo3");
        }

        matchDiv.dataset.match = matchData.match;
        matchDiv.dataset.p1 = matchData.p1;
        matchDiv.dataset.p1wins = p1wins;
        matchDiv.dataset.p2 = matchData.p2;
        matchDiv.dataset.p2wins = p2wins;
        matchDiv.dataset.video = matchData.video;

        const table = document.createElement("table");
        const tbody = document.createElement("tbody");

        const p1Row = document.createElement("tr");
        p1Row.classList.add("underline");
        const p1Name = document.createElement("td");
        p1Name.textContent = matchData.p1;
        p1Row.appendChild(p1Name);
        p1Row.appendChild(createStockIcons(matchData.gameResults, matchData.p1icon, true));

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
                    item.appendChild(matchElement);
                }
            }

            if (matchData.children && matchData.children.length > 0) {
                const childrenContainer = document.createElement("div");
                childrenContainer.classList.add("item-childrens");

                matchData.children.forEach(child => {
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

    function displayBracket() {
        const bracketContainer = document.getElementById("player-bracket");
        bracketContainer.innerHTML = "";
    
        if (playerMatches.length === 0) {
            bracketContainer.innerHTML = `<p>No matches found for ${playerName}.</p>`;
            return;
        }
    
        playerMatches.forEach(yearData => {
            // Create and append the year <p> element
            const yearElement = document.createElement("p");
            yearElement.classList.add("year");
            yearElement.textContent = yearData.year;
            bracketContainer.appendChild(yearElement);
    
            // Append matches for this year
            yearData.matches.forEach(match => {
                bracketContainer.appendChild(buildBracket(match));
            });
        });
    }
    

    loadAndFilterMatches();
});