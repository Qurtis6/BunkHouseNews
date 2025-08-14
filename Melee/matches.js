document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = window.location.search.substring(1); // Removes the "?" at the start
    const playerName = decodeURIComponent(urlParams);

    if (!playerName) {
        console.error("No player specified in URL.");
    } else {
        console.log(`Player page loaded for: ${playerName}`);
    }

    const dataFolder = "/Melee/Tournaments/data/";
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

    async function loadJsonIndex() {
        try {
            const index = await fetchJSON("index.json");
            if (!index || !Array.isArray(index)) throw new Error("Invalid index.json format");
            // reverse to load newest first
            return index.slice().reverse();
        } catch (error) {
            console.error("Error loading index.json:", error);
            return [];
        }
    }

    // Merge helper so a year only has ONE entry
    function addMatchesForYear(year, matches) {
        let existingYear = playerMatches.find(pm => pm.year === year);
        if (existingYear) {
            existingYear.matches.push(...matches);
        } else {
            playerMatches.push({ year, matches: [...matches] });
        }
    }

    async function loadAndFilterMatches() {
        playerMatches = [];
        const jsonFiles = await loadJsonIndex();

        for (const file of jsonFiles) {
            const data = await fetchJSON(file);
            if (!data) continue;

            // winners+pool A-D count as "winners side"; losers+pool E-H count as "losers side"
            const winnersPools = ["winners", "poolA", "poolB", "poolC", "poolD"];
            const losersPools  = ["losers", "poolE", "poolF", "poolG", "poolH"];

            let winnersMatches = winnersPools.flatMap(pool => extractPlayerMatches(data[pool], playerName));
            let losersMatches  = losersPools.flatMap(pool => extractPlayerMatches(data[pool], playerName));

            // Look for finals on winners side (source of truth in your data)
            let grandFinalReset = winnersMatches.find(m => m.match === "Grand Final Reset");
            let grandFinal      = winnersMatches.find(m => m.match === "Grand Finals");

            // Remove finals from winnersMatches roots so we can re-attach properly
            winnersMatches = winnersMatches.filter(m => m.match !== "Grand Finals" && m.match !== "Grand Final Reset");

            // Attach winners chain after last losers match if losers exists,
            // otherwise attach winners chain under Grand Finals if it exists.
            if (losersMatches.length > 0) {
                const lastLosersMatch = findLastMatch(losersMatches);
                if (lastLosersMatch) lastLosersMatch.children.push(...winnersMatches);
                if (grandFinal) grandFinal.children.push(...losersMatches);
            } else if (grandFinal) {
                grandFinal.children.push(...winnersMatches);
            }

            // Final bracket roots for the year
            const finalBracket = [];
            if (grandFinalReset) finalBracket.push(grandFinalReset);
            if (grandFinal)      finalBracket.push(grandFinal);

            const year = file.replace(".json", "");
            if (finalBracket.length > 0) {
                addMatchesForYear(year, finalBracket);
            } else if (winnersMatches.length > 0 || losersMatches.length > 0) {
                // If no GF present, keep whichever side exists (losers already has winners attached if both existed)
                addMatchesForYear(year, losersMatches.length > 0 ? losersMatches : winnersMatches);
            }
        }

        displayBracket();
    }

    // ---- helpers for building/formatting matches ----

    function findLastMatch(matches) {
        if (!matches || matches.length === 0) return null;
        let lastMatch = matches[matches.length - 1];
        while (lastMatch && lastMatch.children && lastMatch.children.length > 0) {
            lastMatch = lastMatch.children[lastMatch.children.length - 1];
        }
        return lastMatch || null;
    }

    function extractPlayerMatches(matches, player) {
        if (!matches) return [];
        let filtered = [];
        matches.forEach(match => {
            const playerInMatch = match.p1 === player || match.p2 === player;
            const childMatches = extractPlayerMatches(match.children, player);

            if (playerInMatch) {
                // keep this match, but only keep relevant children
                const matchCopy = { ...match, children: childMatches };
                filtered.push(matchCopy);
            } else if (childMatches.length > 0) {
                // player appears below this node; lift children up
                filtered.push(...childMatches);
            }
        });
        return filtered;
    }

    function calculateWins(gameResults, player, p1, p2) {
        return gameResults.filter(result =>
            (player === p1 && result === 1) || (player === p2 && result === 0)
        ).length;
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

    // Build ONE match tree (no wrapper)
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

    // Build ONE wrapper per year, and append all root items inside it
    function buildYearBracket(rootMatches) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        rootMatches.forEach(root => {
            const tree = createMatchTree(root);
            if (tree) wrapper.appendChild(tree);
        });
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
            const yearElement = document.createElement("p");
            yearElement.classList.add("year");
            yearElement.textContent = yearData.year;
            bracketContainer.appendChild(yearElement);

            // ONE wrapper per year:
            const yearWrapper = buildYearBracket(yearData.matches);
            bracketContainer.appendChild(yearWrapper);
        });
    }

    loadAndFilterMatches();
});
