function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get("name") || "Unknown",
        tag: params.get("tag") || "No Tag",
        icon: params.get("icon") || null
    };
}

document.addEventListener("DOMContentLoaded", function () {
    const { name, tag, icon } = getQueryParams();

    // Parse tag to remove any HTML styling
    const tempElement = document.createElement("div");
    tempElement.innerHTML = tag;
    const cleanTag = tempElement.textContent || tempElement.innerText;

    // Update player tag display
    if (cleanTag === name) {
        document.getElementById("playerTag").textContent = cleanTag;
    } else {
        document.getElementById("playerTag").textContent = `${cleanTag} (${name})`;
    }

    // Update player icon
    const iconElement = document.getElementById("playerChar");
    if (icon != "smash") {
        iconElement.src = `Images/Classic Poses/Left/${icon}.png`;
        iconElement.style.display = "block"; // Ensure it's visible if set
    } else {
        iconElement.style.display = "none";
    }

    // Extract base character name from icon (remove any color variations)
    let baseIcon = icon ? icon.split("-")[0] : null;

    // Mapping of specific characters to their respective series
    const iconSeriesMapping = {
        "doc": "mario",
        "luigi": "mario",
        "bowser": "mario",
        "peach": "mario",
        "ganon": "zelda",
        "falco": "fox",
        "sheik" : "zelda",
        "link": "zelda",
        "young link": "zelda",
        "pichu": "pikachu",
        "puff": "pikachu",
        "mewtwo": "pikachu",
        "roy": "marth"
    };

    // Check if baseIcon exists in the mapping, if so, replace it
    if (baseIcon in iconSeriesMapping) {
        baseIcon = iconSeriesMapping[baseIcon];
    }

    // Update background image using mapped character series
    const backgroundElement = document.getElementById("background");
    if (backgroundElement && baseIcon) {
        backgroundElement.style.backgroundImage = `url('/Melee/Images/Symbols/${baseIcon}.svg')`;
    }
});
