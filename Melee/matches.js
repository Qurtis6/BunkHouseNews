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

            // Build alias set so URL can be either the real name or the tag
            const aliases = buildAliases(data, playerName);

            // ----- Extract raw player-specific matches for winners (keeps nested structure) -----
            const winnersAll = extractPlayerMatches(data.winners || [], aliases);

            // flatten winners tree into chronological list (earliest -> latest)
            const winnersFlat = flattenMatches(winnersAll);

            // GF detection helper
            const isGF = (m) => {
                const s = (m?.match || "").trim().toLowerCase();
                return s === "grand final" || s === "grand finals" || s === "grand final reset" || s === "grand finals reset";
            };

            // split flattened winners into gfMatches and winnersSansGF
            const gfMatches = winnersFlat.filter(isGF);
            const winnersSansGF = winnersFlat.filter(m => !isGF(m));

            // also extract and flatten other stages
            const poolWinners = flattenMatches(extractPlayerMatches([].concat(data.poolA || [], data.poolB || [], data.poolC || [], data.poolD || []), aliases));
            const poolLosers  = flattenMatches(extractPlayerMatches([].concat(data.poolE || [], data.poolF || [], data.poolG || [], data.poolH || []), aliases));
            const losersFlat  = flattenMatches(extractPlayerMatches(data.losers || [], aliases));

            // ----- Build each stage as a linear chain -----
            const chainGF          = chainMatches(gfMatches,     /*latestFirst=*/true);
            const chainLosers      = chainMatches(losersFlat,    /*latestFirst=*/true);
            const chainPoolLosers  = chainMatches(poolLosers,    /*latestFirst=*/true);
            const chainWinners     = chainMatches(winnersSansGF, /*latestFirst=*/true);
            const chainPoolWinners = chainMatches(poolWinners,   /*latestFirst=*/true);

            // ----- Stitch stages latest → earliest -----
            const root = stitchStages([
                chainGF,
                chainLosers,
                chainPoolLosers,
                chainWinners,
                chainPoolWinners
            ]);

            // ===== Find placement for this tournament (robust lookup) =====
            let placement = null;
            const foundResult = (data.results || []).find(r => {
                const rn = (r.name || "").trim();
                const rt = (r.tag  || "").trim();
                return aliases.has(rn) || aliases.has(rt);
            });
            if (foundResult && typeof foundResult.place === "number") {
                placement = foundResult.place;
            }

            if (root) {
                playerMatches.push({
                    year: file.replace(".json", ""),
                    placement: placement,
                    matches: [root]
                });
            }
        }

        displayBracket();
    }

    // ========== UTILITIES ==========

    function buildAliases(data, player) {
        const set = new Set();
        const p = (player || "").trim();
        if (p) set.add(p);

        (data.results || []).forEach(r => {
            const n = (r.name || "").trim();
            const t = (r.tag  || "").trim();
            // If the URL name matches either the name or tag, add both to aliases
            if (n && (n === p || t === p)) {
                set.add(n);
                if (t) set.add(t);
            }
        });

        return set;
    }

    // Flatten a nested match list into an array ordered earliest -> latest (post-order).
    // Each returned node is a shallow copy with children cleared so we can chain them later.
    function flattenMatches(matches) {
        if (!matches || matches.length === 0) return [];
        const out = [];
        matches.forEach(m => {
            if (m.children && m.children.length > 0) {
                out.push(...flattenMatches(m.children));
            }
            // shallow copy, remove children to avoid keeping nested structure
            const copy = { ...m, children: [] };
            out.push(copy);
        });
        return out;
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
    function chainMatches(matches, latestFirst = true) {
        if (!matches || matches.length === 0) return null;
        if (matches.length === 1) return matches[0];

        // matches expected earliest -> latest
        if (latestFirst) {
            // For i from second-last down to 0: attach earlier as child of later
            for (let i = matches.length - 2; i >= 0; i--) {
                const later = matches[i + 1];
                const earlier = matches[i];
                const tail = findLastMatch([later]);
                if (tail) tail.children = [earlier];
            }
            return matches[matches.length - 1]; // latest as root
        } else {
            // earlier -> later
            for (let i = 0; i < matches.length - 1; i++) {
                const earlier = matches[i];
                const later = matches[i + 1];
                const tail = findLastMatch([earlier]);
                if (tail) tail.children = [later];
            }
            return matches[0]; // earliest as root
        }
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
            const trimmed = (p || "").trim();
            if (playerOrAliases instanceof Set) return playerOrAliases.has(trimmed);
            return trimmed === playerOrAliases;
        };

        let filtered = [];

        matches.forEach(match => {
            const childMatches = extractPlayerMatches(match.children, playerOrAliases);
            const playerInMatch = isHit(match.p1) || isHit(match.p2);

            if (playerInMatch) {
                const matchCopy = { ...match, children: childMatches };
                filtered.push(matchCopy);
            } else if (childMatches.length > 0) {
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

    // ----- Placement suffix helper -----
    function ordinalSuffix(n) {
        if (typeof n !== "number") return "";
        const j = n % 10,
              k = n % 100;
        if (j === 1 && k !== 11) return n + "st";
        if (j === 2 && k !== 12) return n + "nd";
        if (j === 3 && k !== 13) return n + "rd";
        return n + "th";
    }

    function displayBracket() {
        const bracketContainer = document.getElementById("player-bracket");
        bracketContainer.innerHTML = "";

        if (playerMatches.length === 0) {
            bracketContainer.innerHTML = `<p>No matches found for ${playerName}.</p>`;
            return;
        }

        playerMatches.forEach(yearData => {
            const yearWrapper = document.createElement("div");
            yearWrapper.classList.add("year-block");

            const yearElement = document.createElement("p");
            yearElement.classList.add("year");
            yearElement.textContent = yearData.year;
            yearWrapper.appendChild(yearElement);

            if (typeof yearData.placement === "number") {
                const placementElement = document.createElement("p");
                placementElement.classList.add("placement");
                placementElement.textContent = `${ordinalSuffix(yearData.placement)}`;
                yearWrapper.appendChild(placementElement);
            }

            yearData.matches.forEach(match => {
                yearWrapper.appendChild(buildBracket(match));
            });

            bracketContainer.appendChild(yearWrapper);
        });
    }

    loadAndFilterMatches();
});
