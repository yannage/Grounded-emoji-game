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
            
            // Add TV status
            if (gameState.tvLocations.some(tv => tv.x === x && tv.y === y)) {
                const tvStatus = document.createElement("div");
                tvStatus.className = "tv-status";
                
                if (gameState.watchingTV && gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
                    tvStatus.textContent = "ON";
                    cell.style.color = "red";  // TV is on
                } else {
                    tvStatus.textContent = "OFF";
                }
                
                cell.appendChild(tvStatus);
            }
            
            // Add characters
            if (gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
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