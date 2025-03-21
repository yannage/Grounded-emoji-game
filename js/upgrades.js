// Upgrades system
// Handles upgrades that can be purchased between runs

// Apply upgrade effects
function applyUpgradeEffects() {
    // Apply quiet shoes upgrade
    if (gameState.upgrades.quietShoes.owned) {
        gameState.movesLeft = 4;
    }
    
    // Mobile phone effects would be checked when watching shows
    // Bigger TV and snacks effects are applied when calculating points
}

// Update upgrade panel in game over screen
function updateUpgradePanel() {
    const upgradePanel = document.getElementById("upgrade-panel");
    upgradePanel.innerHTML = "";
    
    for (const [key, upgrade] of Object.entries(gameState.upgrades)) {
        const upgradeItem = document.createElement("div");
        upgradeItem.className = "upgrade-item";
        if (upgrade.owned) {
            upgradeItem.classList.add("owned");
        }
        
        upgradeItem.innerHTML = `
            <div>${upgrade.description}</div>
            <div>${upgrade.owned ? "Owned" : `Cost: ${upgrade.cost} pts`}</div>
        `;
        
        if (!upgrade.owned && gameState.totalPoints >= upgrade.cost) {
            upgradeItem.addEventListener("click", () => {
                gameState.totalPoints -= upgrade.cost;
                upgrade.owned = true;
                
                upgradeItem.classList.add("owned");
                upgradeItem.innerHTML = `
                    <div>${upgrade.description}</div>
                    <div>Owned</div>
                `;
                
                document.getElementById("points-earned").textContent = gameState.totalPoints;
            });
        }
        
        upgradePanel.appendChild(upgradeItem);
    }
}

// Initialize all upgrades
function initializeUpgrades() {
    gameState.upgrades = {
        mobilePhone: { owned: false, cost: 1000, description: "Mobile Phone 📱 - Watch shows anywhere" },
        biggerTV: { owned: false, cost: 500, description: "Bigger TV 📺 - Earn 2x points" },
        videoGame: { owned: false, cost: 750, description: "Video Game 🎮 - Alternative entertainment" },
        quietShoes: { owned: false, cost: 300, description: "Quiet Shoes 👟 - Move 4 spaces per turn" },
        lockpick: { owned: false, cost: 200, description: "Lockpick 🔑 - Unlock doors" },
        snacks: { owned: false, cost: 150, description: "Snacks 🍿 - +50% points when watching TV" }
    };
}