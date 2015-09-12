var MAJOR_ISSUE_WEIGHT = 2;
var MINOR_ISSUE_WEIGHT = 1;
var MINOR_ISSUES_PER_PLAYER = 2;

// Expectations
// window.game.players is an array of Player objects. We will replace their assignedIssues property.
// window.game.issues is an array of all the Issues we're playing with in this game. (Probably 5, but we won't assume.)
function assignIssues() {
	assignMajorIssues();
	assignMinorIssues();
}

function assignMajorIssues() {
	var g = window.game;
	
	// Get a shuffled list of issue indexes
	var issueIndexes = [];
	for (var i = 0; i < g.issues.length; i++) {
		issueIndexes.push(i);
	}
	issueIndexes = shuffleArray(issueIndexes);
	
	// Go through the list and assign them to players in order until all players have a major issue
	for (var i = 0; i < g.players.length; i++) {
		var player = g.players[i];
		// 50% chance player will be for or against their major policy
		var inFavour = Math.floor(Math.random() + 0.5) == 1;
		var assignedIssue = new AssignedIssue(issueIndexes[i], MAJOR_ISSUE_WEIGHT, inFavour);
		// Wipe out any existing assigned issues and replace it with just the major one.
		player.assignedIssues = [assignedIssue];
	}
}

function assignMinorIssues() {
	var g = window.game;
	
	
}


