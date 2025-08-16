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
            return index.slice().reverse();
        } catch (error) {
            console.error("Error loading index.json:", error);
            return [];
        }
    }

    async function loadAndFilterMatches() {
        playerMatches = [];
        const jsonFiles = await loadJsonIndex();

        for (const file of jsonFiles) {
            const data = await fetchJSON(file);
            if (!data) continue;

            // Build alias set so the URL can be either the real name or the tag
            const aliases = buildAliases(data, playerName);

            // Winners without Grand Final nodes (we add GFs as a separate stage)
            const winnersNoGF = (data.winners || []).filter(m => !/grand final/i.test(m.match || ""));

            // Extract per stage
            const poolWinners = extractPlayerMatches(
                [].concat(data.poolA || [], data.poolB || [], data.poolC || [], data.poolD || []),
                aliases
            );
            const winners = extractPlayerMatches(winnersNoGF, aliases);
            const poolLosers = extractPlayerMatches(
                [].concat(data.poolE || [], data.poolF || [], data.poolG || [], data.poolH || []),
                aliases
            );
            const losers = extractPlayerMatches(data.losers || [], aliases);

            // Grand Finals (supports "Grand Final", "Grand Finals", "Grand Final Reset")
            const grandFinalsRaw = (data.winners || []).filter(m => /grand final/i.test(m.match || ""));
            // Prefer Reset as latest if both exist
            grandFinalsRaw.sort((a, b) => {
                const rank = (x) => /reset/i.test(x.match || "") ? 2 : 1;
                return rank(a) - rank(b); // GF first, Reset last (we'll chain latest-first below)
            });
            const grandFinals = extractPlayerMatches(grandFinalsRaw, aliases);

            // Build each stage as a linear chain, latest → earliest
            const chainPoolWinners = chainMatches(poolWinners);
            const chainWinners     = chainMatches(winners);
            const chainPoolLosers  = chainMatches(poolLosers);
            const chainLosers      = chainMatches(losers);
            const chainGF          = chainMatches(grandFinals);

            // Stitch stages latest → earliest:
            // GF → Losers → Pool E–H → Winners → Pool A–D
            const root = stitchStages([
                chainGF,
                chainLosers,
                chainPoolLosers,
                chainWinners,
                chainPoolWinners
            ]);

            if (root) {
                playerMatches.push({
                    year: file.replace(".json", ""),
                    matches: [root]
                });
            }
        }

        displayBracket();
    }

    // ========== UTILITIES ==========

    // Build a set of acceptable names for matching (handles "name" vs "tag")
    function buildAliases(data, player) {
        const set = new Set([player]);
        (data.results || []).forEach(r => {
            const n = (r.name || "").trim();
            const t = (r.tag || "").trim();
            if (n && (n === player || t === player)) {
                if (n) set.add(n);
                if (t) set.add(t);
            }
        });
        return set;
    }

    function findLastMatch(matches) {
        if (!matches || matches.length === 0) return null;

        let lastMatch = matches[matches.length - 1];

        while (lastMatch && lastMatch.children && lastMatch.children.length > 0) {
            lastMatch = lastMatch.children[lastMatch.children.length - 1];
        }

        return lastMatch || null;
    }

    // Link multiple matches in a stage into a single linear chain.
    // If latestFirst=true, the FIRST node returned is the latest match,
    // and each child is the prior (earlier) match.
    function chainMatches(matches) {
        if (!matches || matches.length === 0) return null;
        if (matches.length === 1) return matches[0];
        // later → earlier: tail(later) -> earlier
        for (let i = matches.length - 2; i >= 0; i--) {
            const later = matches[i + 1];
            const earlier = matches[i];
            const tail = findLastMatch([later]);
            if (tail) tail.children = [earlier];
        }
        return matches[matches.length - 1]; // latest as root
    }

    // Stitch an ordered list of stage roots, skipping nulls.
    // Expects the list already in desired order (e.g., latest → earliest).
    function stitchStages(stageRoots) {
        const nonNull = stageRoots.filter(Boolean);
        if (nonNull.length === 0) return null;
        for (let i = 0; i < nonNull.length - 1; i++) {
            const laterStage = nonNull[i];
            const earlierStage = nonNull[i + 1];
            const tail = findLastMatch([laterStage]);
            if (tail) tail.children = [earlierStage];
        }
        return nonNull[0]; // latest existing stage as root
    }

    function extractPlayerMatches(matches, playerOrAliases) {
        if (!matches) return [];

        const isHit = (p) => {
            if (!p) return false;
            if (playerOrAliases instanceof Set) return playerOrAliases.has(p);
            return p === playerOrAliases;
        };

        let filtered = [];

        matches.forEach(match => {
            const childMatches = extractPlayerMatches(match.children, playerOrAliases);
            const playerInMatch = isHit(match.p1) || isHit(match.p2);

            if (playerInMatch) {
                // Keep this match and keep only relevant child path(s)
                const matchCopy = { ...match, children: childMatches };
                filtered.push(matchCopy);
            } else if (childMatches.length > 0) {
                // Bubble up relevant child path(s)
                filtered.push(...childMatches);
            }
        });

        return filtered;
    }

    // ========== DISPLAY HELPERS ==========

    function calculateWins(gameResults, player, p1, p2) {
        return gameResults.filter(result => {
            return (player === p1 && result === 1) || (player === p2 && result === 0);
        }).length;
    }

    function createStockIcons(gameResults, playerIconArray, isP1) {
        const container = document.createElement("td");
        container.setAttribute("align", "right");

        if (!Array.isArray(playerIconArray) || playerIconArray.length === 0) {
            // graceful fallback when icons are missing
            gameResults.forEach((result) => {
                const img = document.createElement("img");
                img.src = `/Melee/icons/default-icon.png`;
                img.classList.add(result === (isP1 ? 1 : 0) ? "icon" : "icon-loss");
                container.appendChild(img);
            });
            return container;
        }

        gameResults.forEach((result, index) => {
            const img = document.createElement("img");
            let icon = playerIconArray[Math.min(index, playerIconArray.length - 1)];
            if (!icon || !icon.trim()) icon = "default-icon";
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
            const yearElement = document.createElement("p");
            yearElement.classList.add("year");
            yearElement.textContent = yearData.year;
            bracketContainer.appendChild(yearElement);

            yearData.matches.forEach(match => {
                bracketContainer.appendChild(buildBracket(match));
            });
        });
    }

    loadAndFilterMatches();
});
