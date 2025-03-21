
// Main game logic
// Manages overall game state and initialization

// Game state
const gameState = {
    time: 8 * 60, // Start at 8:00 AM (in minutes)
    day: 1,
    groundedDays: 3,
    score: 0,
    totalPoints: 0,
    movesLeft: 3,
    playerPosition: { x: 2, y: 2 },
    playerHiding: false,
    dadPosition: { x: 7, y: 2 },
    momPosition: { x: 8, y: 2 },
    dadTarget: null,
    momTarget: null,
    suspicion: 0,
    currentShow: null,
    upcomingShows: [],
    watchingTV: false,
    tvLocations: [],
    doorLocations: [],
    lockedDoors: [],
    trashBins: [],
    endOfDay: 22 * 60, // End of day at 10:00 PM
    showsWatched: 0,
    upgrades: {}
};

// End player turn
function endTurn() {
    // Reset moves
    gameState.movesLeft = gameState.upgrades.quietShoes.owned ? 4 : 3;
    
    // Advance time
    gameState.time += 30; // 30 minutes pass
    
    // Check if show ended
    if (gameState.currentShow && gameState.time >= gameState.currentShow.startTime + gameState.currentShow.duration) {
        gameState.currentShow = null;
        showNotification("The show has ended");
    }
    
    // Move parents
    moveParents();
    
    // Generate shows if needed
    if (gameState.upcomingShows.length < 3) {
        generateShows();
    }
    
    // Check if game ended
    if (gameState.time >= gameState.endOfDay) {
        endDay();
        return;
    }
    
    // Check if player is caught
    checkParentDiscovery();
    
    // Check if new show started
    checkForShow();
    
    // Update UI
    updateUI();
    renderGrid();
}

// End the day
function endDay() {
    gameState.day++;
    
    if (gameState.day > gameState.groundedDays) {
        showGameOver("Your grounding is over! You survived!");
    } else {
        // Reset for next day
        gameState.time = 8 * 60; // 8:00 AM
        gameState.playerPosition = { x: 2, y: 2 };
        gameState.playerHiding = false;
        gameState.dadPosition = { x: 7, y: 2 };
        gameState.momPosition = { x: 8, y: 2 };
        gameState.dadTarget = null;
        gameState.momTarget = null;
        gameState.suspicion = 0;
        gameState.currentShow = null;
        gameState.upcomingShows = [];
        gameState.watchingTV = false;
        gameState.movesLeft = gameState.upgrades.quietShoes.owned ? 4 : 3;
        gameState.lockedDoors = [];
        
        // Generate shows for the new day
        generateShows();
        
        showNotification(`Day ${gameState.day} of ${gameState.groundedDays} begins!`);
        updateUI();
        renderGrid();
    }
}

// Player is caught
function playerCaught(message) {
    showGameOver(message);
}

// Initialize game
function initGame() {
    // Initialize upgrades
    initializeUpgrades();
    
    // Create house layout
    createHouseLayout();
    
    // Set up event listeners
    document.getElementById("hide-button").addEventListener("click", toggleHiding);
    document.getElementById("lock-door-button").addEventListener("click", toggleDoorLock);
    document.getElementById("end-turn-button").addEventListener("click", endTurn);
    document.getElementById("restart-button").addEventListener("click", () => {
        document.getElementById("game-over-modal").style.display = "none";
        
        // Reset for new grounding
        gameState.score = 0;
        gameState.day = 1;
        gameState.time = 8 * 60; // 8:00 AM
        gameState.playerPosition = { x: 2, y: 2 };
        gameState.playerHiding = false;
        gameState.dadPosition = { x: 7, y: 2 };
        gameState.momPosition = { x: 8, y: 2 };
        gameState.dadTarget = null;
        gameState.momTarget = null;
        gameState.suspicion = 0;
        gameState.currentShow = null;
        gameState.upcomingShows = [];
        gameState.watchingTV = false;
        gameState.movesLeft = gameState.upgrades.quietShoes.owned ? 4 : 3;
        gameState.lockedDoors = [];
        gameState.showsWatched = 0;
        
        // Generate shows for the new game
        generateShows();
        
        updateUI();
        renderGrid();
    });
    
    // Generate initial shows
    generateShows();
    
    // Render the grid
    renderGrid();
    
    // Fix grid sizing
    fixGridSizing();
    
    // Update UI
    updateUI();
}

// Start the game when everything is loaded
window.addEventListener('load', initGame); 