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
        player.name = $('#name').val();
        $('#addplayerform').prepend('<p>' + $('#name').val() + '</p>');
        $('#name').val('');
        g.players.push(player);
        $('#addtheplayer').html('<span class="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Add another player');
        if (g.players.length > 2) {
            $('#start').show();
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
    $('.bribe').click(function() {
        bribeClicked(this, false);
    });
    $('.lobby').click(function() {
        lobbyClicked(this, false);
    });
    $('.antibribe').click(function() {
        bribeClicked(this, true);
    });
    $('.antilobby').click(function() {
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

function bribeClicked(bribeElement, bluffing) {
    var g = window.game;
    var bribe = new Bribe;
    bribe.party = parseInt($(bribeElement).data('partyid'));
    bribe.round = g.currentRound;
    bribe.issue = parseInt($(bribeElement).data('issueid'));
    bribe.change = 2;
    if (!isPlayerInFavourOfIssue(g.currentlyViewingPlayer, bribe.issue)) {
        bribe.change = -2;
    }
    if (bluffing) {
        bribe.change *= -1;
    }
    bribe.bribingPlayer = g.currentlyViewingPlayer.index;
    g.bribes.push(bribe);

    playerSpentInfluence();
}

function lobbyClicked(lobbyElement, bluffing) {
    var g = window.game;
    var lobby = new Lobby;
    lobby.party = parseInt($(lobbyElement).data('partyid'));
    lobby.round = g.currentRound;
    lobby.issue = parseInt($(lobbyElement).data('issueid'));
    lobby.change = 1;
    if (!isPlayerInFavourOfIssue(g.currentlyViewingPlayer, lobby.issue)) {
        lobby.change = -1;
    }
    if (bluffing) {
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
            var playerButton = $("<button class='btn btn-default' data-dismiss='modal' data-playerid='" + player.index + "' onclick='accusePlayerClicked(this)' data-partyid='" + partyid + "' data-issueid='" + assignedIssue.issuessueid + "'>Accuse " + player.name + "</button>");
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
    $("#currentplayerstatus").hide();
    g.playersDoneInCurrentRound = [];

    // Calculate and display lobbies UI from the last round

    // Calculate and display accusation results from the last round

}

function beginTurn() {
    setCurrentPlayerInfluence();
    setupPlayerButtons();
    updateUI();
    $("#gamescreen").show();
    $("#beginlobbying").hide();
    $("#influencestatus").show();
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

    // Hide polls since player will be passing device to somebody else
    $("#gamescreen").hide();

    if (g.currentRound >= g.maximumRounds) {
        endGame();
    } else {
        // show modal popup "Round complete!"
        $("#roundcomplete").modal('show');
        // Handler for hidden.bs.modal will show results when they press the button
    }
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
    $('.bribe').removeClass('btn-success');
    $('.lobby').removeClass('btn-success');
    $('.antilobby').removeClass('btn-success');
    $('.antibribe').removeClass('btn-success');
    $('.bribe').removeClass('btn-danger');
    $('.lobby').removeClass('btn-danger');
    $('.antilobby').removeClass('btn-danger');
    $('.antibribe').removeClass('btn-danger');

    $("#nextplayername").text(g.currentlyViewingPlayer.name);
    $("#nextplayer").modal('show');
}

function setupPlayerButtons() {
    var g = window.game;
    // Does the Player support this issue? Set colours on that party+issue modal.
    if (g.currentlyViewingPlayer != null) {
        //console.log(g.currentlyViewingPlayer);
        for (var assigned = 0; assigned < g.currentlyViewingPlayer.assignedIssues.length; assigned++) {
            var assignedIssue = g.currentlyViewingPlayer.assignedIssues[assigned];
            //console.log(assignedIssue);
            for (var p = 0; p < g.parties.length; p++) {
                if (assignedIssue.inFavour) {
                    $('#lobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                    $('#bribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                    $('#antilobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                    $('#antibribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                } else {
                    $('#lobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                    $('#bribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-success');
                    $('#antilobbybtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                    $('#antibribebtnP' + p + 'I' + assignedIssue.issue).addClass('btn-danger');
                }
            }
        }
    }


}

function endGame() {
    // show modal for game finished
}

function displayResultsScreen() {

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
