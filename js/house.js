


// House layout and grid system
// Contains room definitions and house structure

// Constants
const ROOMS = {
    WALL: "wall",
    FLOOR: "floor",
    DOOR: "door",
    BEDROOM1: "bedroom",
    BEDROOM2: "bedroom",
    BEDROOM3: "bedroom",
    LIVING_ROOM: "living-room",
    KITCHEN: "kitchen",
    OFFICE: "office",
    BATHROOM: "bathroom",
    ATTIC: "attic",
    BASEMENT: "basement"
};

// Grid dimensions
const WIDTH = 15;
const HEIGHT = 12;

// Initialize empty house grid
let houseGrid = [];
function initializeHouseGrid() {
    houseGrid = [];
    // Create empty grid
    for (let y = 0; y < HEIGHT; y++) {
        houseGrid[y] = [];
        for (let x = 0; x < WIDTH; x++) {
            houseGrid[y][x] = { type: ROOMS.WALL, content: "", room: "" };
        }
    }
}

// Define house layout
function createHouseLayout() {
    initializeHouseGrid();
    
    // Main bedroom (parents)
    for (let y = 1; y < 4; y++) {
        for (let x = 6; x < 10; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.BEDROOM1 };
        }
    }
    houseGrid[1][7] = { type: ROOMS.FLOOR, content: "🛏️", room: ROOMS.BEDROOM1 };
    houseGrid[1][8] = { type: ROOMS.FLOOR, content: "🛏️", room: ROOMS.BEDROOM1 };
    houseGrid[3][9] = { type: ROOMS.FLOOR, content: "📺", room: ROOMS.BEDROOM1 };
    gameState.tvLocations.push({ x: 9, y: 3 });
    houseGrid[3][6] = { type: ROOMS.DOOR, content: "", room: ROOMS.BEDROOM1 };
    gameState.doorLocations.push({ x: 6, y: 3 });

    // Kids bedroom (player)
    for (let y = 1; y < 4; y++) {
        for (let x = 1; x < 5; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.BEDROOM2 };
        }
    }
    houseGrid[1][2] = { type: ROOMS.FLOOR, content: "🛏️", room: ROOMS.BEDROOM2 };
    houseGrid[3][4] = { type: ROOMS.FLOOR, content: "📺", room: ROOMS.BEDROOM2 };
    gameState.tvLocations.push({ x: 4, y: 3 });
    houseGrid[1][4] = { type: ROOMS.FLOOR, content: "🗑️", room: ROOMS.BEDROOM2 };
    gameState.trashBins.push({ x: 4, y: 1 });
    houseGrid[3][1] = { type: ROOMS.DOOR, content: "", room: ROOMS.BEDROOM2 };
    gameState.doorLocations.push({ x: 1, y: 3 });

    // Guest bedroom
    for (let y = 1; y < 4; y++) {
        for (let x = 11; x < 14; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.BEDROOM3 };
        }
    }
    houseGrid[1][12] = { type: ROOMS.FLOOR, content: "🛋️", room: ROOMS.BEDROOM3 };
    houseGrid[3][13] = { type: ROOMS.FLOOR, content: "📺", room: ROOMS.BEDROOM3 };
    gameState.tvLocations.push({ x: 13, y: 3 });
    houseGrid[3][11] = { type: ROOMS.DOOR, content: "", room: ROOMS.BEDROOM3 };
    gameState.doorLocations.push({ x: 11, y: 3 });

    // Living room
    for (let y = 4; y < 8; y++) {
        for (let x = 6; x < 12; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.LIVING_ROOM };
        }
    }
    houseGrid[5][8] = { type: ROOMS.FLOOR, content: "🛋️", room: ROOMS.LIVING_ROOM };
    houseGrid[5][9] = { type: ROOMS.FLOOR, content: "🛋️", room: ROOMS.LIVING_ROOM };
    houseGrid[6][10] = { type: ROOMS.FLOOR, content: "📺", room: ROOMS.LIVING_ROOM };
    gameState.tvLocations.push({ x: 10, y: 6 });
    houseGrid[7][6] = { type: ROOMS.FLOOR, content: "🗑️", room: ROOMS.LIVING_ROOM };
    gameState.trashBins.push({ x: 6, y: 7 });
    houseGrid[4][6] = { type: ROOMS.DOOR, content: "", room: ROOMS.LIVING_ROOM };
    gameState.doorLocations.push({ x: 6, y: 4 });
    houseGrid[4][11] = { type: ROOMS.DOOR, content: "", room: ROOMS.LIVING_ROOM };
    gameState.doorLocations.push({ x: 11, y: 4 });
    houseGrid[7][8] = { type: ROOMS.DOOR, content: "", room: ROOMS.LIVING_ROOM };
    gameState.doorLocations.push({ x: 8, y: 7 });

    // Kitchen
    for (let y = 4; y < 8; y++) {
        for (let x = 1; x < 5; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.KITCHEN };
        }
    }
    houseGrid[5][1] = { type: ROOMS.FLOOR, content: "🍳", room: ROOMS.KITCHEN };
    houseGrid[5][2] = { type: ROOMS.FLOOR, content: "🍽️", room: ROOMS.KITCHEN };
    houseGrid[4][4] = { type: ROOMS.DOOR, content: "", room: ROOMS.KITCHEN };
    gameState.doorLocations.push({ x: 4, y: 4 });
    houseGrid[6][1] = { type: ROOMS.FLOOR, content: "🗑️", room: ROOMS.KITCHEN };
    gameState.trashBins.push({ x: 1, y: 6 });

    // Office
    for (let y = 4; y < 8; y++) {
        for (let x = 12; x < 14; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.OFFICE };
        }
    }
    houseGrid[5][13] = { type: ROOMS.FLOOR, content: "💻", room: ROOMS.OFFICE };
    houseGrid[6][13] = { type: ROOMS.FLOOR, content: "🗑️", room: ROOMS.OFFICE };
    gameState.trashBins.push({ x: 13, y: 6 });
    houseGrid[4][12] = { type: ROOMS.DOOR, content: "", room: ROOMS.OFFICE };
    gameState.doorLocations.push({ x: 12, y: 4 });

    // Bathroom
    for (let y = 4; y < 6; y++) {
        for (let x = 3; x < 5; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.BATHROOM };
        }
    }
    houseGrid[4][3] = { type: ROOMS.FLOOR, content: "🚽", room: ROOMS.BATHROOM };
    houseGrid[5][4] = { type: ROOMS.FLOOR, content: "🛁", room: ROOMS.BATHROOM };
    houseGrid[5][3] = { type: ROOMS.DOOR, content: "", room: ROOMS.BATHROOM };
    gameState.doorLocations.push({ x: 3, y: 5 });

    // Hallway
    for (let y = 4; y < 8; y++) {
        for (let x = 5; x < 6; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: "hallway" };
        }
    }
    
    // Hallway - upstairs
    for (let y = 3; y < 4; y++) {
        for (let x = 1; x < 14; x++) {
            if (houseGrid[y][x].type === ROOMS.WALL) {
                houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: "hallway" };
            }
        }
    }

    // Attic
    for (let y = 0; y < 1; y++) {
        for (let x = 11; x < 14; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.ATTIC };
        }
    }
    houseGrid[0][12] = { type: ROOMS.FLOOR, content: "📦", room: ROOMS.ATTIC };
    houseGrid[0][13] = { type: ROOMS.FLOOR, content: "🗑️", room: ROOMS.ATTIC };
    gameState.trashBins.push({ x: 13, y: 0 });
    houseGrid[1][12] = { type: ROOMS.DOOR, content: "", room: ROOMS.ATTIC };
    gameState.doorLocations.push({ x: 12, y: 1 });

    // Basement
    for (let y = 8; y < 11; y++) {
        for (let x = 3; x < 8; x++) {
            houseGrid[y][x] = { type: ROOMS.FLOOR, content: "", room: ROOMS.BASEMENT };
        }
    }
    houseGrid[9][4] = { type: ROOMS.FLOOR, content: "🧸", room: ROOMS.BASEMENT };
    houseGrid[9][6] = { type: ROOMS.FLOOR, content: "📺", room: ROOMS.BASEMENT };
    gameState.tvLocations.push({ x: 6, y: 9 });
    houseGrid[10][3] = { type: ROOMS.FLOOR, content: "🗑️", room: ROOMS.BASEMENT };
    gameState.trashBins.push({ x: 3, y: 10 });
    houseGrid[8][5] = { type: ROOMS.DOOR, content: "", room: ROOMS.BASEMENT };
    gameState.doorLocations.push({ x: 5, y: 8 });

    // Stairs
    houseGrid[7][5] = { type: ROOMS.FLOOR, content: "🪜", room: "stairs" };
    houseGrid[8][5] = { type: ROOMS.FLOOR, content: "🪜", room: "stairs" };
}

// Check if a character is in a specific room
function isInRoom(position, roomType) {
    return houseGrid[position.y][position.x].room === roomType;
}

// Find the center of a specific room
function findCenterOfRoom(roomType) {
    const roomCells = [];
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            if (houseGrid[y][x].room === roomType) {
                roomCells.push({x, y});
            }
        }
    }
    
    if (roomCells.length === 0) {
        return { x: 7, y: 3 }; // Default to hallway
    }
    
    // Calculate center of room
    const centerIndex = Math.floor(roomCells.length / 2);
    return roomCells[centerIndex];
}

// Check if a character can move to a specific cell
function canMoveTo(x, y) {
    // Check boundaries
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
        return false;
    }
    
    // Check if wall
    if (houseGrid[y][x].type === ROOMS.WALL) {
        return false;
    }
    
    // Check if locked door
    if (houseGrid[y][x].type === ROOMS.DOOR && 
        gameState.lockedDoors.some(door => door.x === x && door.y === y)) {
        return false;
    }
    
    return true;
}

// Check if a move is valid for the player
function isValidMove(x, y) {
    // Check if cell is a wall
    if (houseGrid[y][x].type === ROOMS.WALL) {
        return false;
    }
    
    // Check if cell has a parent
    if (gameState.dadPosition.x === x && gameState.dadPosition.y === y ||
        gameState.momPosition.x === x && gameState.momPosition.y === y) {
        return false;
    }
    
    // Check if door is locked
    if (houseGrid[y][x].type === ROOMS.DOOR && 
        gameState.lockedDoors.some(door => door.x === x && door.y === y)) {
        return false;
    }
    
    // Check if move is through a door or follows a path
    const playerX = gameState.playerPosition.x;
    const playerY = gameState.playerPosition.y;
    
    // If moving diagonally, ensure there's a clear path
    if (playerX !== x && playerY !== y) {
        return false;
    }
    
    // Check if path is clear
    if (playerX === x) {
        // Moving vertically
        const start = Math.min(playerY, y);
        const end = Math.max(playerY, y);
        for (let i = start + 1; i < end; i++) {
            if (houseGrid[i][x].type === ROOMS.WALL || 
                (houseGrid[i][x].type === ROOMS.DOOR && 
                 gameState.lockedDoors.some(door => door.x === x && door.y === i))) {
                return false;
            }
        }
    } else {
        // Moving horizontally
        const start = Math.min(playerX, x);
        const end = Math.max(playerX, x);
        for (let i = start + 1; i < end; i++) {
            if (houseGrid[y][i].type === ROOMS.WALL || 
                (houseGrid[y][i].type === ROOMS.DOOR && 
                 gameState.lockedDoors.some(door => door.x === i && door.y === y))) {
                return false;
            }
        }
    }
    
    return true;
}
