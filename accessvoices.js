/* Data structures */

// These do not necessarily need to have all fields set in the constructor.
// Feel free to move them into the prototype.

var Player = function(name, index) {
	this.index = window.game.players.length;
	this.name = name;			// Player's name
	this.assignedIssues = [];	// Array of AssignedIssue
	this.finalScore = 0;		// Calculated and set after final round
	this.minorSuccess = 0;		// How many minor issues did they get?
	this.majorSuccess = 0;		// How many major issues did they get?
	this.influence = 0;			// the amount of influence this player has to play with in this round
}

var Issue = function(name) {
	this.name = name;			// Displayed name of issue
	this.policyPassed = null;	// Will be set to true or false after final round
	var idx = window.game.issues.length;
	var code = 65 + idx; // 'A' + idx
	this.alpha = String.fromCharCode(code);	// A, B, C, D, E etc.
}

var AssignedIssue = function(issue, weighting, inFavour) {
	this.issue = issue;			// Index of an Issue object
	this.weighting = weighting;	// Number of points Player gets if they achieve their desired outcome
	this.inFavour = inFavour;	// The Player gets the points if they are in favour and it passes,
								// or if they are not in favour and it doesn't pass
}

var Party = function(name, initialIssueScores, icon, image) {
	this.name = name;			// Name of Party
	// Array with one element per issue
	// Probably something like [3, 4, 3, 4, 3]
	this.initialIssueScores = initialIssueScores;
	this.icon = icon;
	this.image = image;
}

var Game = function() {
	this.currentlyViewingPlayer = null;		// Which player currently sitting at the PC? (null for none)
	this.currentRound = 0;					// What round at we up to. 1-5, 0 for not yet in game
	this.playersDoneInCurrentRound = [];	// Array of Player objects
	this.players = [];						// Array of Player objects
	this.accusations = [];					// Array of Accusation objects
	this.bribes = [];						// Array of Bribe objects
	this.lobbies = [];						// Array of Lobby objects
	this.issues = [];						// Array of Issue objects
	this.parties = [];						// Array of Party objects
	this.maximumRounds = 5;					// How many rounds in the game
}

var Accusation = function(accuser, accused, party, issue, successful, round) {
	this.accuser = accuser;		// Index of the Player making the accusation
	this.accused = accused;		// Index of the Player accused of making a bribe
	this.party = party;			// Index of the Party who is alleged to have received the bribe
	this.issue = issue;			// Index of the Issue about which they Party is alleged to have been bribed
	this.successful = successful; // true/false about whether the accusation was for a bribe that happened
	this.round = round;			// What round of the game this accusation was made (i.e. for a bribe in round - 1)
}

var Bribe = function(party, issue, bribingPlayer, round, change) {
	this.party = party;			// Index of Party who was bribed
	this.issue = issue;			// Index of Issue which the party was bribed about
	this.bribingPlayer = bribingPlayer;	// Index of the player who made the bribe
	this.round = round;			// Round of game in which the bribe was made
	this.change = change;		// Number added to or removed from the opinion
}

var Lobby = function(party, issue, lobbyingPlayer, round, change) {
	this.party = party;			// Index of Party who was lobbied
	this.issue = issue;			// Index of Issue which the party was lobbied about
	this.lobbyingPlayer = lobbyingPlayer;	// Index of the player who did the lobbying
	this.round = round;			// Round of game in which the lobbying was made
	this.change = change;		// Number added to or removed from the opinion
}

