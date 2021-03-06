function gameplayInit() {
    var g = window.game;

    // splashscreen
    $('#showaddplayer').click(function() {
        $('#splashscreen').hide();
        $('#addplayer').show();
    });

    // addplayer
    $('#addtheplayer').click(function(event) {
        event.preventDefault();
        var player = new Player();
        if ($('#name').val() != '') {
            player.name = $('#name').val();
            $('#addplayerform').prepend('<p>' + $('#name').val() + '</p>');
            $('#name').val('');
            g.players.push(player);
            $('#addtheplayer').html('<span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add another player');
            if (g.players.length > 2) {
                $('#start').show();
                $('#addplayer-instructions').hide();
            }
        }
    });
    $('#start').click(function(event) {
        event.preventDefault();
        $('#addplayer').hide();
        assignIssues();
        updateUI();
        $('#gamescreen').show();
        window.game.currentRound = 1;
    });

    // gamescreen
    $('.bribe-up').click(function() {
        bribeClicked(this, false);
    });
    $('.lobby-up').click(function() {
        lobbyClicked(this, false);
    });
    $('.bribe-down').click(function() {
        bribeClicked(this, true);
    });
    $('.lobby-down').click(function() {
        lobbyClicked(this, true);
    });

    // It's the start of the round
    // Select the first player and prompt to hand over the device
    $("#beginlobbying").click(function() {
        endTurn();
    });

    $("#roundcomplete").modal({
        show: false
    });
    $("#roundcomplete").on("hidden.bs.modal", function() {
        beginRound();
    });

    $("#nextplayer").modal({
        show: false
    });
    $("#nextplayer").on("hidden.bs.modal", function() {
        beginTurn();
    });

    $("#accusesuccess").modal({
        show: false
    });
    $("#accusefail").modal({
        show: false
    });

    $("#influencestatus").hide();
    $(".right-hansard").hide();
    $("#currentplayerstatus").hide();

    $(".issue-modal").on("show.bs.modal", function() {
        var g = window.game;

        if (g.currentlyViewingPlayer == null) {
            return false;
        }
        $(".playerstoaccuse").empty();

        var p = g.currentlyViewingPlayer.index;
        var alreadyAccused = false;
        for (var i = 0; i < g.accusations.length; i++) {
            var acc = g.accusations[i];
            if (acc.accuser == p && acc.round == g.currentRound) {
                alreadyAccused = true;
            }
        }

        if (alreadyAccused) {
            $(".btn.accuse").attr("disabled", true);
        } else {
            $(".btn.accuse").attr("disabled", false);
        }
    });
}

function bribeClicked(bribeElement, down) {
    var g = window.game;
    var bribe = new Bribe;
    bribe.party = parseInt($(bribeElement).data('partyid'));
    bribe.round = g.currentRound;
    bribe.issue = parseInt($(bribeElement).data('issueid'));
    bribe.change = 2;
    if (down) {
        bribe.change *= -1;
    }
    bribe.bribingPlayer = g.currentlyViewingPlayer.index;
    g.bribes.push(bribe);

    playerSpentInfluence();
}

function lobbyClicked(lobbyElement, down) {
    var g = window.game;
    var lobby = new Lobby;
    lobby.party = parseInt($(lobbyElement).data('partyid'));
    lobby.round = g.currentRound;
    lobby.issue = parseInt($(lobbyElement).data('issueid'));
    lobby.change = 1;
    if (down) {
        lobby.change *= -1;
    }
    lobby.lobbyingPlayer = g.currentlyViewingPlayer.index;
    g.lobbies.push(lobby);

    playerSpentInfluence();
}

function accuseClicked(button) {
    var g = window.game;
    var accuseButtonsDiv = $(button).parent().children(".playerstoaccuse");

    // If it has buttons just show/hide it
    if ($(accuseButtonsDiv).children().length > 0) {
        $(accuseButtonsDiv).toggle();
    } else {
        // If no buttons yet, fill it in and show it
        $(accuseButtonsDiv).empty();
        for (var i = 0; i < g.players.length; i++) {
            if (i == g.currentlyViewingPlayer.index) {
                continue;
            }
            var player = g.players[i];
            var partyid = parseInt($(button).data("partyid"));
            var issueid = parseInt($(button).data("issueid"));
            			var playerButton = $("<button class='btn btn-default' data-dismiss='modal' data-playerid='" + player.index + "' onclick='accusePlayerClicked(this)' data-partyid='" + partyid + "' data-issueid='" + issueid + "'>Accuse " + player.name + "</button>");
            $(accuseButtonsDiv).append(playerButton);
        }
        $(accuseButtonsDiv).show();
    }
}

function accusePlayerClicked(playerButton) {
    var g = window.game;
    var accused = parseInt($(playerButton).data("playerid"));
    var partyid = parseInt($(playerButton).data("partyid"));
    var issueid = parseInt($(playerButton).data("issueid"));
    // Add the accusation
    var accusation = new Accusation();
    accusation.accuser = g.currentlyViewingPlayer.index;
    accusation.accused = accused;
    accusation.party = partyid;
    accusation.issue = issueid;
    accusation.round = g.currentRound;

    // Was it successful? Figure this out by going through past rounds
    accusation.successful = false; // default
    for (var i = 0; i < g.bribes.length; i++) {
        var bribe = g.bribes[i];
        if (bribe.round == (accusation.round - 1) && bribe.bribingPlayer == accusation.accused && bribe.party == accusation.party && bribe.issue == accusation.issue) {
            // Yes that player did bribe on that issue last round!
            accusation.successful = true;
        }
    }
    g.accusations.push(accusation);

    if (accusation.successful) {
        $("#accusesuccess").modal("show");
    } else {
        $("#accusefail").modal("show");
    }
}



// User has pressed "Close" on the "Round complete" dialog - set up for new round
function beginRound() {
    var g = window.game;
    // set up UI to be the graph that everyone can see with all the last round's actions applied
    g.currentlyViewingPlayer = null;
    updateUI();
    $("#gamescreen").show();
    $("#beginlobbying").show();
    $("#influencestatus").hide();
    $(".right-hansard").hide();
    $("#currentplayerstatus").hide();
    g.playersDoneInCurrentRound = [];

    // Calculate and display accusation results from the last round
	$("#hansard-accusations").empty();
    for (var i = 0; i < g.accusations.length; i++) {
    	var a = g.accusations[i];
    	if (a.round == (g.currentRound - 1)) {
	    	var accuser = g.players[a.accuser].name;
    		var accused = g.players[a.accused].name;
    		var party = g.parties[a.party].name;
    		var issue = g.issues[a.issue].alpha;
    		var accText;
    		if (a.successful) {
    			accText = "<b>" + accused + "</b> was <b>guilty</b> of bribing <b>" + party + "</b> on issue <b>" + issue + "</b>, caught by <b>" + accuser + "</b>!";
    		} else {
    			accText = "<b>" + accused + "</b> was accused of bribing <b>" + party + "</b> on issue <b>" + issue + "</b> by <b>" + accuser + "</b> but they were deemed innocent.";
    		}

    		$("#hansard-accusations").append($("<li>").html(accText));
    	}
    }

    // Calculate and display lobbies UI from the last round
	$("#hansard-lobbying").empty();
    for (var i = 0; i < g.lobbies.length; i++) {
    	var l = g.lobbies[i];
    	if (l.round == (g.currentRound - 1)) {
    		var player = g.players[l.lobbyingPlayer].name;
    		var issue = g.issues[l.issue].alpha;
    		var party = g.parties[l.party].name;
    		var lobbyText = "<b> " + player + "</b> lobbied party <b>" + party + "</b>.";
    		$("#hansard-lobbying").append($("<li>").html(lobbyText));
    	}
    }

}

function beginTurn() {
    setCurrentPlayerInfluence();
    setupPlayerButtons();
    updateUI();
    $("#gamescreen").show();
    $("#beginlobbying").hide();
    $("#influencestatus").show();
    $(".right-hansard").show();
    $("#currentplayerstatus").show();
}

function setCurrentPlayerInfluence() {
    var g = window.game;

    // Start on 2
    var influence = 2;

    // Remove 1 for each successful accusation against you
    // Add 1 for each successful accusation you made
    // Make sure the final answer is >= 1
    for (var i = 0; i < g.accusations.length; i++) {
        var acc = g.accusations[i];
        if (acc.round == (g.currentRound - 1) && acc.accused == g.currentlyViewingPlayer.index && acc.successful == true) {
            influence--;
        }
        if (acc.round == (g.currentRound - 1) && acc.accuser == g.currentlyViewingPlayer.index && acc.successful == true) {
            influence++;
        }
    }
    if (influence < 1) {
        influence = 1;
    }

    g.currentlyViewingPlayer.influence = influence;
}

function playerSpentInfluence() {
    var g = window.game;
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

    updateUI();
}

function endRound() {
    var g = window.game;

    // all players have entered their info for this round
    g.currentRound += 1;
    
    if (g.currentRound > g.maximumRounds) {
    	endGame();
    	return;
    }

    // disable accusations and bribes for the last round
    if (g.currentRound == g.maximumRounds) {
        $('.bribe-down').hide();
        $('.bribe-up').hide();
        $('.accuse').hide();
        $('.modal-header').append('<p><strong style="color:red">This is the last round</strong></p>');
    }

    // Hide polls since player will be passing device to somebody else
    $("#gamescreen").hide();


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
        g.currentlyViewingPlayer = g.players[g.playersDoneInCurrentRound.length];
    }
    $("#currentplayer").text(g.currentlyViewingPlayer.name);

    // clear modal button colours
    $('.bribe-up').removeClass('btn-success');
    $('.lobby-up').removeClass('btn-success');
    $('.bribe-down').removeClass('btn-success');
    $('.lobby-down').removeClass('btn-success');
    $('.bribe-up').removeClass('btn-danger');
    $('.lobby-up').removeClass('btn-danger');
    $('.bribe-down').removeClass('btn-danger');
    $('.lobby-down').removeClass('btn-danger');
    // and any player specific modal info (reset to the default message)
    $('.modalinfo').html('<p>You have no particular interest in this bill</p>');

    $("#nextplayername").text(g.currentlyViewingPlayer.name);
    $("#nextplayer").modal('show');
}

function setupPlayerButtons() {
    var g = window.game;
    // Does the Player support this issue? Set colours on that party+issue modal.
    if (g.currentlyViewingPlayer != null) {
        for (var assigned = 0; assigned < g.currentlyViewingPlayer.assignedIssues.length; assigned++) {
            var assignedIssue = g.currentlyViewingPlayer.assignedIssues[assigned];
            for (var p = 0; p < g.parties.length; p++) {
                if (assignedIssue.inFavour) {
                    $('#lobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                    $('#bribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                    $('#antilobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                    $('#antibribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                    if (assignedIssue.weighting == MAJOR_ISSUE_WEIGHT) {
                        modalmsg = 'very';
                    } else {
                        modalmsg = 'quite';
                    }
                    modalmsg += ' interested in blocking this bill ';
                    $('#modalinfoP' + p + 'I' + assignedIssue.issue).html('');
                } else {
                    $('#lobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                    $('#bribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                    $('#antilobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                    $('#antibribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                    if (assignedIssue.weighting == MAJOR_ISSUE_WEIGHT) {
                        modalmsg = 'very';
                    } else {
                        modalmsg = 'quite';
                    }
                    modalmsg += ' interested in getting this bill passed';
                }
                $('#modalinfoP' + p + 'I' + assignedIssue.issue).html('<p>You are '+modalmsg+'</p>');
            }
        }
    }


}

function endGame() {
	var g = window.game;
    // Calculate who won
    // Update UI, then we can use the "polls" global
    g.currentlyViewingPlayer = null;
    updateUI();
    
    // For each player, count how many major and minor issues they got right
    for (var i = 0; i < g.players.length; i++) {
    	var p = g.players[i];
    	for (j = 0; j < p.assignedIssues.length; j++) {
    		var a = p.assignedIssues[j];
    		// Loop through the parties and get their final poll
    		var partiesFor = 0;
    		var partiesAgainst = 0;
    		for (var k = 0; k < g.parties.length; k++) {
    			var scores = polls[k][a.issue];
    			var finalPoll = scores[scores.length - 1];
    			if (finalPoll >= 4) {
    				partiesFor++;
    			} else {
    				partiesAgainst++;
    			}
    		}
    		if ((partiesFor > partiesAgainst && a.inFavour)
    				|| (partiesFor < partiesAgainst && !a.inFavour)) {
    			if (a.weighting == MAJOR_ISSUE_WEIGHT) {
    				p.majorSuccess++;
    			} else {
    				p.minorSuccess++;
    			}
    			p.finalScore += a.weighting;
    		}
    	}
    }
    
    // Fill in the information on the results screen
    for (var i = 0; i < g.players.length; i++) {
    	var p = g.players[i];
    	
    	var text = "<b>" + p.name + "</b>: <b>" + p.finalScore + "</b> points (" + p.majorSuccess + " major and " + p.minorSuccess + " minor)";
    	var li = $("<li>").html(text);
    	$("#finalscore ul").append(li);
    }
    
    // Show the results screen
    $("#finalscore").show();
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

function showTheModal(el) {
	var target = $(el).data("target");
	$(target).modal("show");
}
