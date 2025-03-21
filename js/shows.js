
// TV Shows system
// Manages show generation and watching functionality

// Generate shows
function generateShows() {
    // Clear old shows that have passed
    gameState.upcomingShows = gameState.upcomingShows.filter(show => 
        show.startTime + show.duration > gameState.time);
        
    // Add new shows
    while (gameState.upcomingShows.length < 5) {
        // Random start time between current time and end of day
        const startTime = Math.floor(gameState.time + Math.random() * (gameState.endOfDay - gameState.time - 60));
        
        // Random duration (30 or 60 minutes)
        const durations = [30, 60];
        let duration = durations[Math.floor(Math.random() * durations.length)];
        
        // 10% chance for a marathon (3 hours)
        if (Math.random() < 0.1) {
            duration = 180;
        }
        
        // Generate show title
        const showTitles = [
            "Cosmic Explorers",
            "Ocean Friends",
            "Mystery Falls",
            "Galaxy Gems",
            "Teen Heroes",
            "The Incredible Life of Max",
            "Star Princess vs. Evil",
            "Element Masters",
            "Park Pals",
            "Summer Inventors",
            "Robot High School",
            "Monster Tamers",
            "Dimension Hoppers",
            "Magical Misfits",
            "Cyber Warriors"
        ];
        
        const title = showTitles[Math.floor(Math.random() * showTitles.length)];
        
        // Add show
        gameState.upcomingShows.push({
            title,
            startTime,
            duration,
            marathon: duration === 180
        });
    }
    
    // Sort shows by start time
    gameState.upcomingShows.sort((a, b) => a.startTime - b.startTime);
}

// Toggle TV on/off
function toggleTV() {
    // Check if at a TV
    if (gameState.tvLocations.some(tv => 
        tv.x === gameState.playerPosition.x && tv.y === gameState.playerPosition.y)) {
        gameState.watchingTV = !gameState.watchingTV;
        
        // Check if a show is on
        if (gameState.watchingTV) {
            checkForShow();
        } else {
            gameState.currentShow = null;
        }
        
        // Increase suspicion
        if (gameState.watchingTV) {
            gameState.suspicion += 10;
            showNotification("TV turned ON! Parents' suspicion increased!");
        } else {
            showNotification("TV turned OFF");
        }
        
        // Update UI
        updateUI();
        renderGrid();
    }
}

// Check if a show is on
function checkForShow() {
    if (!gameState.watchingTV) return;
    
    // Check if already watching a show
    if (gameState.currentShow) return;
    
    // Check if a show is starting
    for (const show of gameState.upcomingShows) {
        if (show.startTime <= gameState.time && 
            (gameState.time < show.startTime + show.duration)) {
            
            gameState.currentShow = show;
            
            // Calculate points
            let points = show.duration;
            
            // Apply multipliers
            if (gameState.upgrades.biggerTV.owned) {
                points *= 2;
            }
            
            if (gameState.upgrades.snacks.owned) {
                points = Math.floor(points * 1.5);
            }
            
            gameState.score += points;
            gameState.totalPoints += points;
            gameState.showsWatched++;
            
            showNotification(`You started watching "${show.title}"! +${points} points!`);
            break;
        }
    }
}