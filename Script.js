// === GAME CONFIG ===
const ROOMS = ["bedroom", "livingroom", "bathroom", "parentsroom", "basement"];
const SHOWS = [
  "Noodle Ninjas", "Battle Bugs", "Gizmo Galaxy", "Chomp Champs", "Pajama Patrol",
  "Slime High", "Toaster Time", "Socks & Scissors", "Barkitects", "Waffle Wasteland"
];

let gameTime = 1230; // in HHMM format
let timeInterval = null;
let currentShow = null;
let showsToday = [];
let watching = false;
let caught = false;
let score = 0;
let lockedDoors = {};
let kidRoom = "bedroom";
let parentRoom = "livingroom";
let hideStatus = false;

// === DOM ELEMENTS ===
const clockEl = document.getElementById("clock");
const showAlert = document.getElementById("showAlert");
const kidEl = document.getElementById("kid");
const parentEl = document.getElementById("parent");
const statsScreen = document.getElementById("statsScreen");
const statsContent = document.getElementById("statsContent");

// === INIT ===
startNewDay();

function startNewDay() {
  score = 0;
  gameTime = 1230;
  watching = false;
  caught = false;
  hideStatus = false;
  lockedDoors = {};
  kidRoom = "bedroom";
  parentRoom = "livingroom";
  statsScreen.classList.add("hidden");
  scheduleShows();
  moveCharacter(kidEl, kidRoom);
  moveCharacter(parentEl, parentRoom);
  updateClock();
  timeInterval = setInterval(progressTime, 5000);
}

function scheduleShows() {
  showsToday = [];
  const numShows = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < numShows; i++) {
    const time = randomTime();
    const duration = Math.random() < 0.3 ? 60 : 30;
    const name = SHOWS[Math.floor(Math.random() * SHOWS.length)];
    showsToday.push({ time, name, duration, watched: 0 });
  }
  showsToday.sort((a, b) => a.time - b.time);
}

function randomTime() {
  const hour = 13 + Math.floor(Math.random() * 6); // 1pm - 6pm
  const minute = Math.random() < 0.5 ? 0 : 30;
  return hour * 100 + minute;
}

function progressTime() {
  if (caught) return;
  gameTime = advance30Min(gameTime);
  updateClock();

  // Check if show starts
  const now = gameTime;
  const show = showsToday.find(s => s.time === now);
  if (show) {
    currentShow = show;
    showAlert.innerText = `"${show.name}" is on! Find a TV!`;
  }

  // Watching a show?
  if (watching && currentShow) {
    currentShow.watched += 30;
    score += 100;

    if (currentShow.duration === currentShow.watched) {
      watching = false;
      showAlert.innerText = `You finished "${currentShow.name}"! Next show soon...`;
      currentShow = null;
    }
  }

  patrolParent();

  // End of day
  if (gameTime >= 1800) {
    clearInterval(timeInterval);
    endDay();
  }
}

function updateClock() {
  const h = Math.floor(gameTime / 100);
  const m = gameTime % 100;
  clockEl.innerText = `Time: ${h}:${m === 0 ? "00" : m}`;
}

function advance30Min(time) {
  let h = Math.floor(time / 100);
  let m = time % 100 + 30;
  if (m >= 60) {
    h++;
    m = 0;
  }
  return h * 100 + m;
}

function moveCharacter(el, room) {
  const target = document.getElementById(room);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const gameRect = document.getElementById("game").getBoundingClientRect();
  el.style.left = (rect.left - gameRect.left + 10) + "px";
  el.style.top = (rect.top - gameRect.top + 10) + "px";
}

function patrolParent() {
  // Simple patrol pattern
  const possibleRooms = ROOMS.filter(r => r !== parentRoom);
  parentRoom = possibleRooms[Math.floor(Math.random() * possibleRooms.length)];
  moveCharacter(parentEl, parentRoom);

  // If TV is on
  if (watching && !hideStatus) {
    showAlert.innerText = randomParentQuote();
    // Start moving parent toward kid
    parentRoom = kidRoom;
    moveCharacter(parentEl, parentRoom);
    if (kidRoom === parentRoom && !hideStatus) {
      youGotCaught();
    }
  }

  if (kidRoom === parentRoom && !hideStatus && watching) {
    youGotCaught();
  }
}

function randomParentQuote() {
  const lines = [
    "You better not be watching TV!",
    "That better not be what I think I hear!",
    "You know you're grounded!",
    "Don't make me come in there!"
  ];
  return lines[Math.floor(Math.random() * lines.length)];
}

// === PLAYER ACTIONS ===
document.querySelectorAll(".room").forEach(roomDiv => {
  roomDiv.addEventListener("click", () => {
    if (caught) return;
    kidRoom = roomDiv.id;
    moveCharacter(kidEl, kidRoom);
  });
});

document.querySelectorAll(".tv").forEach(tv => {
  tv.addEventListener("click", (e) => {
    if (caught || !currentShow || watching) return;
    const room = tv.dataset.room;
    if (room === kidRoom) {
      watching = true;
      showAlert.innerText = `You're watching "${currentShow.name}"...`;
    }
  });
});

function hide() {
  if (caught) return;
  if (["bedroom", "parentsroom"].includes(kidRoom)) {
    hideStatus = true;
    showAlert.innerText = "You're hiding...";
    setTimeout(() => {
      hideStatus = false;
      showAlert.innerText = "";
    }, 5000);
  }
}

function lockDoor() {
  if (caught || !kidRoom) return;
  if (!lockedDoors[kidRoom]) {
    lockedDoors[kidRoom] = 1;
    showAlert.innerText = "You locked the door!";
  } else if (lockedDoors[kidRoom] === 1) {
    lockedDoors[kidRoom]++;
    showAlert.innerText = "They broke the lock!";
    if (parentRoom === kidRoom) {
      youGotCaught();
    }
  } else {
    showAlert.innerText = "You can’t lock it again.";
  }
}

function youGotCaught() {
  caught = true;
  watching = false;
  showAlert.innerText = "You got caught watching TV!";
  clearInterval(timeInterval);
  setTimeout(endDay, 1500);
}

function endDay() {
  statsScreen.classList.remove("hidden");
  let html = `<p>Score: ${score}</p><ul>`;
  for (const show of showsToday) {
    const pct = Math.round((show.watched / show.duration) * 100);
    const bonus = show.duration > 30 ? " (Marathon!)" : "";
    html += `<li>${show.name}: ${pct}% watched${bonus}</li>`;
  }
  html += "</ul>";
  statsContent.innerHTML = html;
}
