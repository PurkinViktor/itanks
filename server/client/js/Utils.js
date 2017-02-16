var Utils = {
    getInfoGameExtend: function (gameInfo) {
        var maxPlayers = 0;
        var countPlayers = 0;
        var textTeamsInfo = "";
        for (var t in gameInfo.teamsOfGame) {
            var team = gameInfo.teamsOfGame[t];
            maxPlayers += team.maxCountPlayers;
            countPlayers += team.countPlayers;
            if (textTeamsInfo != "") {
                textTeamsInfo = textTeamsInfo + "x";
            }
            textTeamsInfo += team.maxCountPlayers;
        }
        var textCountPlayers = "(" + countPlayers + '/' + maxPlayers + ")";
        var textTeamsInfo = "[" + textTeamsInfo + "]";

        var t = {
            title: "" + gameInfo.nameGame + " " + textTeamsInfo + " - " + textCountPlayers,
            value: gameInfo.nameGame,
            size: textTeamsInfo
        };

        return t;
    }
};
