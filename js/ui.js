// UI functions
// Handles all the user interface updates and rendering

// Render the house grid
function renderGrid() {
    const gridElement = document.getElementById("house-grid");
    gridElement.innerHTML = "";
    
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("div");
            const cellData = houseGrid[y][x];
            
            cell.className = `cell ${cellData.type}`;
            if (cellData.room) {
                cell.classList.add(cellData.room);
            }
            
            // Add door status
            if (cellData.type === ROOMS.DOOR) {
                if (gameState.lockedDoors.some(door => door.x === x && door.y === y)) {
                    cell.classList.add("locked");
                    cell.textContent = "🔒";
                } else {
                    cell.textContent = "🚪";
                }
            }
            // Add content (furniture, etc.)
            else if (cellData.content) {
                cell.textContent = cellData.content;
            }
            
            // Handle TV locations and player rendering
            if (gameState.tvLocations.some(tv => tv.x === x && tv.y === y)) {
                // Create a container for layering TV and player
                const contentContainer = document.createElement("div");
                contentContainer.style.position = "relative";
                contentContainer.style.width = "100%";
                contentContainer.style.height = "100%";
                contentContainer.style.display = "flex";
                contentContainer.style.justifyContent = "center";
                contentContainer.style.alignItems = "center";
                cell.appendChild(contentContainer);
                
                // Add TV character
                const tvElement = document.createElement("div");
                tvElement.style.position = "absolute";
                tvElement.style.zIndex = gameState.watchingTV ? "5" : "1"; // TV on top when on
                tvElement.textContent = "📺";
                
                // Add glow effect if TV is on
                if (gameState.watchingTV && gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
                    tvElement.classList.add("tv-on");
                }
                
                contentContainer.appendChild(tvElement);
                
                // Add player if on same cell
                if (gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
                    const playerElement = document.createElement("div");
                    playerElement.style.position = "absolute";
                    playerElement.style.zIndex = gameState.watchingTV ? "4" : "6"; // Player behind when watching
                    
                    if (gameState.playerHiding) {
                        playerElement.textContent = "🫥";
                    } else {
                        playerElement.textContent = "👦";
                        // Add transparency if watching TV
                        if (gameState.watchingTV) {
                            playerElement.style.opacity = "0.5";
                        }
                    }
                    
                    contentContainer.appendChild(playerElement);
                }
                
                // Add TV status at bottom of cell
                const tvStatus = document.createElement("div");
                tvStatus.className = "tv-status";
                
                if (gameState.watchingTV && gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
                    tvStatus.textContent = "ON";
                    tvStatus.classList.add("on");
                } else {
                    tvStatus.textContent = "OFF";
                }
                
                cell.appendChild(tvStatus);
            } 
            // Continue with the other character rendering for non-TV cells
            else if (gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
                if (gameState.playerHiding) {
                    cell.textContent = "🫥";
                } else {
                    cell.textContent = "👦";
                }
            } else if (gameState.dadPosition.x === x && gameState.dadPosition.y === y) {
                cell.textContent = "👨";
            } else if (gameState.momPosition.x === x && gameState.momPosition.y === y) {
                cell.textContent = "👩";
            }
            
            // Highlight reachable cells
            if (gameState.movesLeft > 0 && !gameState.playerHiding) {
                const distance = Math.abs(gameState.playerPosition.x - x) + Math.abs(gameState.playerPosition.y - y);
                if (distance > 0 && distance <= gameState.movesLeft && isValidMove(x, y)) {
                    cell.classList.add("reachable");
                }
            }
            
            // Add click event
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener("click", () => handleCellClick(x, y));
            
            gridElement.appendChild(cell);
        }
    }
    
    // Ensure cells have proper dimensions for mobile
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        // Makes sure cells are square
        const width = cell.offsetWidth;
        cell.style.height = width + 'px';
    });
}

// Update UI
function updateUI() {
    // Update time
    const hours = Math.floor(gameState.time / 60);
    const minutes = gameState.time % 60;
    const period = hours < 12 ? "AM" : "PM";
    const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    
    document.getElementById("game-time").textContent = 
        `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
        
    // Update day counter
    document.getElementById("day-counter").textContent = gameState.day;
    document.getElementById("grounded-days").textContent = gameState.groundedDays;
    
    // Update moves
    document.getElementById("moves-counter").textContent = gameState.movesLeft;
    
    // Update score
    document.getElementById("score-display").textContent = gameState.score;
    document.getElementById("total-points-display").textContent = gameState.totalPoints;
    
    // Update next show
    const nextShow = gameState.upcomingShows.find(show => show.startTime > gameState.time);
    if (nextShow) {
        const nextShowHours = Math.floor(nextShow.startTime / 60);
        const nextShowMinutes = nextShow.startTime % 60;
        const nextShowPeriod = nextShowHours < 12 ? "AM" : "PM";
        const nextShowHour12 = nextShowHours === 0 ? 12 : nextShowHours > 12 ? nextShowHours - 12 : nextShowHours;
        
        document.getElementById("next-show-time").textContent = 
            `${nextShowHour12}:${nextShowMinutes.toString().padStart(2, "0")} ${nextShowPeriod}`;
        document.getElementById("next-show-length").textContent = nextShow.duration;
    } else {
        document.getElementById("next-show-time").textContent = "None";
        document.getElementById("next-show-length").textContent = "0";
    }
    
    // Update action buttons
    document.getElementById("hide-button").disabled = !gameState.trashBins.some(bin => 
        Math.abs(gameState.playerPosition.x - bin.x) + 
        Math.abs(gameState.playerPosition.y - bin.y) <= 1);
        
    document.getElementById("lock-door-button").disabled = !gameState.doorLocations.some(door => 
        Math.abs(gameState.playerPosition.x - door.x) + 
        Math.abs(gameState.playerPosition.y - door.y) <= 1);
        
    // Add this for the TV button
    document.getElementById("tv-button").disabled = !gameState.tvLocations.some(tv => 
        tv.x === gameState.playerPosition.x && tv.y === gameState.playerPosition.y);
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById("notification");
    notification.textContent = message;
    notification.style.display = "block";
    
    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

// Show game over
function showGameOver(message) {
    document.getElementById("game-over-title").textContent = "Game Over!";
    document.getElementById("game-over-message").textContent = message;
    document.getElementById("final-score").textContent = gameState.score;
    document.getElementById("shows-watched").textContent = gameState.showsWatched;
    document.getElementById("points-earned").textContent = gameState.totalPoints;
    
    // Update upgrades panel
    updateUpgradePanel();
    
    document.getElementById("game-over-modal").style.display = "flex";
}

// Fix grid sizing issues
function fixGridSizing() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        // Makes sure cells are square
        const width = cell.offsetWidth;
        cell.style.height = width + 'px';
    });
}

// Window resize handler
window.addEventListener('resize', () => {
    fixGridSizing();
});

// Fix grid sizing issues
function fixGridSizing() {
    // For mobile, we'll use a different approach
    if (window.innerWidth < 600) {
        const gridElement = document.getElementById("house-grid");
        const gridWidth = gridElement.offsetWidth;
        const cellSize = gridWidth / 15; // 15 columns
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            // Adjust font size based on cell size
            cell.style.fontSize = `${Math.max(cellSize * 0.5, 10)}px`;
        });
    } else {
        // Original desktop behavior
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const width = cell.offsetWidth;
            cell.style.height = width + 'px';
        });
    }
}

// Fix grid
function fixGridSizing() {
    const gridElement = document.getElementById("house-grid");
    const gridWidth = gridElement.offsetWidth;
    const cellSize = Math.floor(gridWidth / 15); // 15 columns
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        // Remove any margin or padding that might cause inconsistency
        cell.style.margin = "0";
        cell.style.boxSizing = "border-box";
    });
}
    
    // For mobile, ensure proper scrolling
    if (window.innerWidth < 600) {
        // Make sure grid has minimum width to be usable
        gridElement.style.minWidth = "380px";
        
        const cells = document.querySelectorAll('.cell');
        const cellSize = Math.floor(gridElement.offsetWidth / 15); // 15 columns
        
        cells.forEach(cell => {
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            // Scale font size based on cell size
            cell.style.fontSize = `${Math.max(cellSize * 0.5, 10)}px`;
        });
    } else {
        // For desktop
        const cells = document.querySelectorAll('.cell');
        const cellSize = Math.floor(gridElement.offsetWidth / 15);
        
        cells.forEach(cell => {
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
        });
    }
}