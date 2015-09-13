var MIN_POLL_VALUE = 1;
var MAX_POLL_VALUE = 6;

function updateUI() {
	updatePollUI();
	updateInfluence();
	updateRowHighlights();
}

// Calculate all the histogram values based on initial data and subsequent actions.
// Regenerate those divs accordingly
function updatePollUI() {
	var g = window.game;

	var issuesCount = g.issues.length;

	// Assuming histogram divs already exist
	// They will have 0-indexed ids like: histogram-party0-issue1

	// We'll build up the data in this structure
	var polls = [];

	// polls[party_index][issue_index] = array of scores from 1-6
	for (var i = 0; i < g.parties.length; i++) {
		polls.push([]);
		for (var j = 0; j < g.issues.length; j++) {
			polls[i].push([]);
		}
	}

	// Start by setting initial values from the party objects
	for (var i = 0; i < g.parties.length; i++) {
		var party = g.parties[i];
		for (var j = 0; j < party.initialIssueScores.length; j++) {
			var score = party.initialIssueScores[j];
			polls[i][j].push(score);
		}
	}

	// For each round, for each party, for each issue,
	// apply all of the lobbies and bribes and set the next value
	for (var r = 1; r < g.currentRound; r++) {
		// Start off by copying the values from the previous round
		for (var p = 0; p < g.parties.length; p++) {
			for (var i = 0; i < g.issues.length; i++) {
				var previous = polls[p][i][r-1];
				polls[p][i].push(previous);
			}
		}

		// Now go through all the lobbies and bribes, filter them by this round, and apply + and -
		for (var b = 0; b < g.bribes.length; b++) {
			var bribe = g.bribes[b];
			if (bribe.round == r) {
				var newValue = limitPoll(polls[bribe.party][bribe.issue][r] + bribe.change);
				polls[bribe.party][bribe.issue][r] = newValue;
			}
		}
		for (var l = 0; l < g.lobbies.length; l++) {
			var lobby = g.lobbies[l];
			if (lobby.round == r) {
				var newValue = limitPoll(polls[lobby.party][lobby.issue][r] + lobby.change);
				polls[lobby.party][lobby.issue][r] = newValue;
			}
		}
	}

	// In theory they're all correct now
	// For each div, clear the existing content then redo the histogram creation
	for (var p = 0; p < g.parties.length; p++) {
		for (var i = 0; i < g.issues.length; i++) {
			// Does the Player support this issue? Set colour on final bar of histogram accordingly.
			var colourSetting = HISTOGRAM_COLOURS_NEUTRAL;
			if (g.currentlyViewingPlayer != null) {
				console.log(g.currentlyViewingPlayer);
				for (var assigned = 0; assigned < g.currentlyViewingPlayer.assignedIssues.length; assigned++) {
					var assignedIssue = g.currentlyViewingPlayer.assignedIssues[assigned];
					console.log(assignedIssue);
					if (assignedIssue.issue == i) {
						if (assignedIssue.inFavour) {
							colourSetting = HISTOGRAM_COLOURS_NORMAL;
						} else {
							colourSetting = HISTOGRAM_COLOURS_INVERTED;
						}
					}
				}
			}


			var divId = "histogram-party" + p + "-issue" + i;
			$("#" + divId).empty();
			createHistogram(divId, polls[p][i], g.maximumRounds + 1, colourSetting);
		}
	}
}

function limitPoll(score) {
	if (score > MAX_POLL_VALUE) {
		score = MAX_POLL_VALUE;
	}
	if (score < MIN_POLL_VALUE) {
		score = MIN_POLL_VALUE;
	}
	return score;
}

function updateInfluence() {
	var p = window.game.currentlyViewingPlayer;
	if (p != null) {
		$("#remaininginfluence").text(window.game.currentlyViewingPlayer.influence);
	}
}

function updateRowHighlights() {
	$(".issuerow").removeClass("row-major");
	$(".issuerow").removeClass("row-minor");
	issueRows = $(".issuerow");
	var p = window.game.currentlyViewingPlayer;
	if (p != null) {
		var issues = p.assignedIssues;
		for (var i = 0; i < issues.length; i++) {
			var assignedIssue = issues[i];
			if (assignedIssue.weighting == MAJOR_ISSUE_WEIGHT) {
				$(issueRows[assignedIssue.issue]).addClass("row-major");
			}
			if (assignedIssue.weighting == MINOR_ISSUE_WEIGHT) {
				$(issueRows[assignedIssue.issue]).addClass("row-minor");
			}
		}
	}
}


