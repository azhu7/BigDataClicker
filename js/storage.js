/** Save player state to local storage. */
function save() {
	localStorage.setItem(strings.savedPlayer, JSON.stringify(player));
}

function fixLoadedObjects() {
	for (var i = 0; i < player.buildings.length; i++) {
		player.buildings[i] = new Building(
			player.buildings[i].factor,
			player.buildings[i].cost,
			player.buildings[i].owned,
			player.buildings[i].manual);
	}
}

/** Load player state from local storage. */
function load() {
	$.extend(true, player, JSON.parse(localStorage.getItem(strings.savedPlayer)));
	fixLoadedObjects();
}

/** Wipe player state from local storage. */
function wipe() {
    var confirmation = confirm("Are you sure you want to permanently erase your savefile?");
    if (confirmation === true) {
        init();
        localStorage.setItem(strings.savedPlayer, JSON.stringify(player));
        updateAll();
    }
}