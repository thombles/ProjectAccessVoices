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
	
	// Possibly enough the most efficient approach
	// But it does ensure it's not egregiously unfair

	var totalMinorIssueAssignments = g.players.length * MINOR_ISSUES_PER_PLAYER;
	
	// Get an evenly shuffled stream of issue indexes at least totalMinorIssueAssignments at length
	var randomisedIssues = [];
	var issuesCount = g.issues.length;
	var shufflesRequired = totalMinorIssueAssignments / issuesCount + 1;
	for (var i = 0; i < shufflesRequired; i++) {
		var issueIndexes = [];
		for (var j = 0; j < g.issues.length; j++) {
			issueIndexes.push(j);
		}
		issueIndexes = shuffleArray(issueIndexes);
		randomisedIssues = randomisedIssues.concat(issueIndexes);
	}
	
	var inFavourAssignments = {};
	var notInFavourAssignments = {};
	for (var i = 0; i < g.issues.length; i++) {
		inFavourAssignments[i] = 0;
		notInFavourAssignments[i] = 0;
	}
	
	// Now give each player the required number of issues from the random stream
	// For each one assigned, make sure it corrects any favour imbalance in previous assignments for the same issues
	for (var p = 0; p < g.players.length; p++) {
		var player = g.players[p];
		for (var i = 0; i < MINOR_ISSUES_PER_PLAYER; i++) {
			var index = p * MINOR_ISSUES_PER_PLAYER + i;
			var issueIndex = randomisedIssues[index];
			
			// By default, random
			var inFavour = Math.floor(Math.random() + 0.5) == 1;
			// But if there have been more in favour than not in favour, be not in favour
			if (inFavourAssignments[issueIndex] > notInFavourAssignments[issueIndex]) {
				inFavour = false;
			}
			// Or if it's the other way around, be not in favour
			if (inFavourAssignments[issueIndex] < notInFavourAssignments[issueIndex]) {
				inFavour = true;
			}
			
			// Update the counts for the current item
			if (inFavour) {
				inFavourAssignments[issueIndex]++;
			} else {
				notInFavourAssignments[issueIndex]++;
			}
			
			// Finally, create an assignment
			var assignedIssue = new AssignedIssue(issueIndex, MINOR_ISSUE_WEIGHT, inFavour);
			player.assignedIssues.push(assignedIssue);
		}
	}
}


function isPlayerInFavourOfIssue(playerIndex, issueIndex) {
	var player = window.game.players[playerIndex];
	var supportsIssue = null;
	for (var assigned = 0; assigned < player.assignedIssues.length; assigned++) {
		var assignedIssue = player.assignedIssues[assigned];
		if (assignedIssue.issue == issueIndex) {
			supportsIssue = assignedIssue.inFavour;
		}
	}
	return supportsIssue;
}


