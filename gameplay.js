function gameplayInit() {
	var g = window.game;
	
	// splashscreen
    $('#showaddplayer').click(function() {
        $('#splashscreen').hide();
        $('#addplayer').show();
    });

    // addplayer
    $('#addtheplayer').click(function() {
        event.preventDefault();
        var player = new Player();
        player.name = $('#name').val();
        $('#addplayerform').prepend('<p>' + $('#name').val() + '</p>');
        $('#name').val('');
        g.players.push(player);
        $('#start').show();
    });
    $('#start').click(function() {
        event.preventDefault();
        $('#addplayer').hide();
        assignIssues();
        updateUI();
        $('#gamescreen').show();
    });

    // gamescreen
    $('.bribe').click(function() {
        var g = window.game;
        var bribe = new Bribe;
        bribe.party = parseInt($(this).data('partyid'));
        bribe.round = g.currentRound;
        bribe.issue = parseInt($(this).data('issueid'));
        bribe.change = 2;
        bribe.bribingPlayer = g.currentlyViewingPlayer;
        g.bribes.push(bribe);
    });
    
    // It's the start of the round
    // Select the first player and prompt to hand over the device
    $("#beginlobbying").click(function() {
    	endTurn();
    });
    
    $("#roundcomplete").modal({show: false});
    $("#roundcomplete").on("hidden.bs.modal", function () {
		beginRound();
	});
	
	$("#nextplayer").modal({show: false});
	$("#nextplayer").on("hidden.bs.modal", function() {
		beginTurn();
	});
	
	$("#influencestatus").hide();
}


// User has pressed "Close" on the "Round complete" dialog - set up for new round
function beginRound() {
	// set up UI to be the graph that everyone can see with all the last round's actions applied
	g.currentPlayer = null;
	updateUI();
	$("#gamescreen").show();
	$("#beginlobbying").show();
	
	// Calculate and display lobbies UI from the last round
	
	// Calculate and display accusation results from the last round
	
}

function beginTurn() {
	setCurrentPlayerInfluence();
	updateUI();
	$("#gamescreen").show();
	$("#beginlobbying").hide();
	$("#influencestatus").show();
}

function setCurrentPlayerInfluence() {
	var g = window.game;
	g.currentlyViewingPlayer.influence = 2;
}

function playerSpentInfluence() {
	g.currentlyViewingPlayer.influence -= 1;
	
	if (g.currentlyViewingPlayer.influence <= 0) {
		// this player's turn is done
		g.playersDoneInCurrentRound.push(g.currentlyViewingPlayer);
		if (g.playersDoneInCurrentRound.length == g.players.length) {
			endRound();
		} else {
			// get next player's input
			endTurn();
		}
	}
}

function endRound() {
	// all players have entered their info for this round
	g.currentRound += 1;
	
	// Hide polls since player will be passing device to somebody else
	$("#gamescreen").hide();
	
	if (g.currentRound >= g.maximumRounds) {
		endGame();
	}
	
	// show modal popup "Round complete!"
	$("#roundcomplete").modal('show');
	// Handler for hidden.bs.modal will show results when they press the button
}

function endTurn() {
	var g = window.game;
	$("#gamescreen").hide();
	
	// show modal popup for next player
	if (g.currentlyViewingPlayer == null) {
		g.currentlyViewingPlayer = g.players[0];
	} else {
		// Just go to next player in order
		g.currentlyViewingPlayer = g.playersDoneInCurrentRound.length;
	}

	$("#nextplayername").text(g.currentlyViewingPlayer.name);
	$("#nextplayer").modal('show');
}

function endGame() {

}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
