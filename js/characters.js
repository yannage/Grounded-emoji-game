// Character movement and interactions
// Handles player and parents movement, and discovery

// Move character towards target
function moveCharacterTowardsTarget(position, target) {
    // Calculate direction
    const dx = target.x - position.x;
    const dy = target.y - position.y;
    
    // Move horizontally or vertically (not diagonally)
    if (Math.abs(dx) > Math.abs(dy)) {
        // Move horizontally
        if (dx > 0) {
            // Move right if possible
            if (canMoveTo(position.x + 1, position.y)) {
                position.x += 1;
            } else if (dy !== 0 && canMoveTo(position.x, position.y + (dy > 0 ? 1 : -1))) {
                // Try vertical movement if horizontal is blocked
                position.y += (dy > 0 ? 1 : -1);
            }
        } else {
            // Move left if possible
            if (canMoveTo(position.x - 1, position.y)) {
                position.x -= 1;
            } else if (dy !== 0 && canMoveTo(position.x, position.y + (dy > 0 ? 1 : -1))) {
                // Try vertical movement if horizontal is blocked
                position.y += (dy > 0 ? 1 : -1);
            }
        }
    } else {
        // Move vertically
        if (dy > 0) {
            // Move down if possible
            if (canMoveTo(position.x, position.y + 1)) {
                position.y += 1;
            } else if (dx !== 0 && canMoveTo(position.x + (dx > 0 ? 1 : -1), position.y)) {
                // Try horizontal movement if vertical is blocked
                position.x += (dx > 0 ? 1 : -1);
            }
        } else {
            // Move up if possible
            if (canMoveTo(position.x, position.y - 1)) {
                position.y -= 1;
            } else if (dx !== 0 && canMoveTo(position.x + (dx > 0 ? 1 : -1), position.y)) {
                // Try horizontal movement if vertical is blocked
                position.x += (dx > 0 ? 1 : -1);
            }
        }
    }
}

// Move parents
function moveParents() {
    // Dad's movement pattern: bedroom -> office -> living room
    if (!gameState.dadTarget) {
        if (isInRoom(gameState.dadPosition, ROOMS.BEDROOM1)) {
            gameState.dadTarget = findCenterOfRoom(ROOMS.OFFICE);
        } else if (isInRoom(gameState.dadPosition, ROOMS.OFFICE)) {
            gameState.dadTarget = findCenterOfRoom(ROOMS.LIVING_ROOM);
        } else if (isInRoom(gameState.dadPosition, ROOMS.LIVING_ROOM)) {
            gameState.dadTarget = findCenterOfRoom(ROOMS.BEDROOM1);
        } else {
            // If not in a defined room, go to bedroom
            gameState.dadTarget = findCenterOfRoom(ROOMS.BEDROOM1);
        }
    }
    
    // Move dad towards target
    if (gameState.dadTarget) {
        moveCharacterTowardsTarget(gameState.dadPosition, gameState.dadTarget);
        
        // Check if dad reached target
        if (gameState.dadPosition.x === gameState.dadTarget.x && 
            gameState.dadPosition.y === gameState.dadTarget.y) {
            gameState.dadTarget = null;
        }
    }
    
    // Mom's movement pattern: bedroom -> kitchen -> attic -> basement
    if (!gameState.momTarget) {
        if (isInRoom(gameState.momPosition, ROOMS.BEDROOM1)) {
            gameState.momTarget = findCenterOfRoom(ROOMS.KITCHEN);
        } else if (isInRoom(gameState.momPosition, ROOMS.KITCHEN)) {
            gameState.momTarget = findCenterOfRoom(ROOMS.ATTIC);
        } else if (isInRoom(gameState.momPosition, ROOMS.ATTIC)) {
            gameState.momTarget = findCenterOfRoom(ROOMS.BASEMENT);
        } else if (isInRoom(gameState.momPosition, ROOMS.BASEMENT)) {
            gameState.momTarget = findCenterOfRoom(ROOMS.BEDROOM1);
        } else {
            // If not in a defined room, go to bedroom
            gameState.momTarget = findCenterOfRoom(ROOMS.BEDROOM1);
        }
    }
    
    // Move mom towards target
    if (gameState.momTarget) {
        moveCharacterTowardsTarget(gameState.momPosition, gameState.momTarget);
        
        // Check if mom reached target
        if (gameState.momPosition.x === gameState.momTarget.x && 
            gameState.momPosition.y === gameState.momTarget.y) {
            gameState.momTarget = null;
        }
    }
    
    // Check if TV is on or suspicion is high, parents might change route
    if (gameState.watchingTV || gameState.suspicion > 50) {
        // 30% chance to change route if TV is on
        if (Math.random() < 0.3) {
            // Dad might check other bedrooms or bathroom
            if (Math.random() < 0.5) {
                gameState.dadTarget = findCenterOfRoom(ROOMS.BEDROOM2);
            } else {
                gameState.dadTarget = findCenterOfRoom(ROOMS.BATHROOM);
            }
            
            // Mom might check other bedrooms or bathroom
            if (Math.random() < 0.5) {
                gameState.momTarget = findCenterOfRoom(ROOMS.BEDROOM3);
            } else {
                gameState.momTarget = findCenterOfRoom(ROOMS.BATHROOM);
            }
        }
    }
    
    // Gradually reduce suspicion
    if (gameState.suspicion > 0) {
        gameState.suspicion -= 1;
    }
}

// Check if player is discovered by parents
function checkParentDiscovery() {
    if (gameState.playerHiding) {
        return false;
    }
    
    // Check if in same cell as a parent
    if ((gameState.playerPosition.x === gameState.dadPosition.x && 
         gameState.playerPosition.y === gameState.dadPosition.y) ||
        (gameState.playerPosition.x === gameState.momPosition.x && 
         gameState.playerPosition.y === gameState.momPosition.y)) {
        
        if (gameState.watchingTV) {
            playerCaught("You were caught watching TV!");
            return true;
        }
    }
    
    // Check if adjacent to a parent
    const adjacentToDad = Math.abs(gameState.playerPosition.x - gameState.dadPosition.x) + 
                         Math.abs(gameState.playerPosition.y - gameState.dadPosition.y) <= 1;
                         
    const adjacentToMom = Math.abs(gameState.playerPosition.x - gameState.momPosition.x) + 
                         Math.abs(gameState.playerPosition.y - gameState.momPosition.y) <= 1;
    
    if ((adjacentToDad || adjacentToMom) && gameState.watchingTV) {
        playerCaught("A parent heard the TV and caught you!");
        return true;
    }
    
    return false;
}

// Handle cell click for player movement
function handleCellClick(x, y) {
    // Check if TV click
    if (gameState.tvLocations.some(tv => tv.x === x && tv.y === y) && 
        gameState.playerPosition.x === x && gameState.playerPosition.y === y) {
        toggleTV();
        return;
    }
    
    // Don't allow moves when hiding
    if (gameState.playerHiding) {
        return;
    }
    
    // Check if valid move
    if (gameState.movesLeft > 0) {
        const distance = Math.abs(gameState.playerPosition.x - x) + Math.abs(gameState.playerPosition.y - y);
        if (distance > 0 && distance <= gameState.movesLeft && isValidMove(x, y)) {
            // Move player
            gameState.playerPosition = { x, y };
            gameState.movesLeft -= distance;
            
            // Check if discovered by parents
            checkParentDiscovery();
            
            // Update UI
            updateUI();
            renderGrid();
        }
    }
}

// Toggle hiding
function toggleHiding() {
    // Check if player is near a trash bin
    const nearTrashBin = gameState.trashBins.some(bin => 
        Math.abs(gameState.playerPosition.x - bin.x) + 
        Math.abs(gameState.playerPosition.y - bin.y) <= 1);
        
    if (nearTrashBin) {
        gameState.playerHiding = !gameState.playerHiding;
        
        if (gameState.playerHiding) {
            showNotification("You're hiding! Parents can't see you.");
        } else {
            showNotification("You stopped hiding.");
        }
        
        updateUI();
        renderGrid();
    } else {
        showNotification("You need to be near a trash bin to hide!");
    }
}

// Toggle lock on door
function toggleDoorLock() {
    // Check if player is near a door
    let nearDoor = null;
    for (const door of gameState.doorLocations) {
        if (Math.abs(gameState.playerPosition.x - door.x) + 
            Math.abs(gameState.playerPosition.y - door.y) <= 1) {
            nearDoor = door;
            break;
        }
    }
    
    if (nearDoor) {
        // Check if door is already locked
        const isLocked = gameState.lockedDoors.some(
            door => door.x === nearDoor.x && door.y === nearDoor.y);
        
        if (isLocked) {
            // Unlock door
            gameState.lockedDoors = gameState.lockedDoors.filter(
                door => !(door.x === nearDoor.x && door.y === nearDoor.y));
            showNotification("Door unlocked!");
        } else {
            // Lock door
            gameState.lockedDoors.push({...nearDoor});
            showNotification("Door locked! Parents can't enter.");
        }
        
        updateUI();
        renderGrid();
    } else {
        showNotification("You need to be near a door to lock/unlock it!");
    }
}