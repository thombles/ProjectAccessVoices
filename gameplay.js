$(document).ready(function() {


    window.players = [];
    window.issues = [];
    var issue = new Issue;
    // TODO load up some sample issues here
    for (i = 1; i < 6; ++i) {
    	issue = new Issue;
        issue.name = 'Issue ' + i;
        issues.push(issue);
    }
    for (i = 0; i < issues.length; ++i) {
        $('#issues').append('<div class="issuerow" data-id="'+i+'"><div class="issue">' + issues[i].name + '</div></div>');
    }

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
        window.players.push(player);
    });
    $('#start').click(function() {
        event.preventDefault();
        $('#addplayer').hide();
        $('#gamescreen').show();
    });

    // gamescreen

});
