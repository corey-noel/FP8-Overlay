var timestamp;
var jsonDoc;
var animating = false;
var doUpdate = false;

function init() {
    pollHandler();
    var timeout = this.window.setInterval(function() { pollHandler(); }, 250);
}

function pollHandler() {
    loadData();

    if (!animating && doUpdate) {
        updateAll();
        doUpdate = false;
    }
}

function loadData() {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType('text/json');

    xhr.open('GET', 'streamcontrol.json');
    xhr.send();
    xhr.onreadystatechange = function(){
        if (xhr.readyState != 4 || xhr.status != 200) { return; }

        var temp = JSON.parse(xhr.responseText);
        if (temp.timestamp == timestamp) { return; }

        jsonDoc = temp;
        doUpdate = true;
        timestamp = jsonDoc.timestamp;
    }
}

function updateText(tagName, val, dur = 250, height = 10) {
    if ($(tagName).length == 0) { return; }
    if ($(tagName).html() == val) { return; }

    animating = true;
    $(tagName).animate(
        {'margin-top': height + 'px', 'opacity': 0},
        {'duration': dur, 'queue': false, 'complete': function() {
            $(tagName).html(val);
            $(tagName).css("margin-top", (height * -1) + "px");
            $(tagName).animate(
                {'margin-top': '0px', 'opacity': 1},
                {'duration': dur, 'queue': false, 'complete': function() {
                animating = false;
            }});
    }});
}

function updatePlayerIcon(tagName, port, char, teamColor = null, dur = 250, height = 10) {
    if ($(tagName).length == 0) { return; }
    if (port == 0 || char == "") {
        $(tagName).hide();
        return;
    }

    var res = getPlayerIcon(port, char, teamColor);
    if (res == null) {
        $(tagName).hide();
        return;
    }

    var icon = '<img class="playerIcon" src="images/chars/' + res + '.png">';
    var offset = ((port - 1) * 39) + "px";

    console.log($(tagName).css("margin-left"));

    if ($(tagName).html() == icon && $(tagName).css("margin-left") == offset) { return; }

    animating = true;
    $(tagName).animate(
        {'padding-top': height + "px", 'opacity':0},
        {'duration': dur, 'queue': false, 'complete': function() {
            $(tagName).html(icon);
            $(tagName).css("margin-left", offset);
            $(tagName).show();
            $(tagName).css("padding-top", "-" + height + "px");
            $(tagName).animate(
                {'padding-top': "0px", 'opacity':1},
                {'duration': dur, 'queue': false, 'complete': function() {
                animating = false;
            }});
    }});
}

function concatPlayerName(playerName, sponsor) {
    if (sponsor) {
        return sponsor + " | " + playerName;
    }

    return playerName;
}

function getLosers(losers) {
    if (losers == 1) {
        return "Losers";
    }
    return "";
}

function getPlayerIcon(port, char, teamColor) {
    var color;
    var series;

    if (teamColor == null) {
        switch (parseInt(port)) {
            case 1:
                color = "red";
                break;
            case 2:
                color = "blue";
                break;
            case 3:
                color = "yellow";
                break;
            case 4:
                color = "green";
                break;
            default:
                return null;
        }
    } else {
        color = teamColor.toLowerCase();
    }

    switch(char.toLowerCase()) {
        case "mario":
        case "luigi":
        case "peach":
        case "bowser":
        case "doc":
        case "dr mario":
        case "dr. mario":
            series = "mario";
            break;
        case "yoshi":
        case "egg":
            series = "yoshi";
            break;
        case "donkey kong":
        case "dk":
            series = "dk";
            break;
        case "link":
        case "zelda":
        case "sheik":
        case "ganondorf":
        case "young link":
        case "yl":
        case "ganon":
            series = "zelda";
            break;
        case "samus":
        case "metroid":
            series = "metroid";
            break;
        case "kirby":
            series = "kirby";
            break;
        case "fox":
        case "falco":
        case "starfox":
        case "sf":
        case "star fox":
            series = "starfox";
            break;
        case "pikachu":
        case "jigglypuff":
        case "puff":
        case "jiggs":
        case "pichu":
        case "mewtwo":
        case "mew two":
            series = "pokemon";
            break;
        case "captain falcon":
        case "falcon":
        case "cf":
        case "captain":
            series = "fzero";
            break;
        case "ness":
        case "mother":
        case "earthbound":
            series = "mother";
            break;
        case "ice climbers":
        case "ics":
        case "climbers":
        case "ic":
            series = "ics";
            break;
        case "marth":
        case "roy":
        case "fire emblem":
        case "fe":
            series = "fire_emblem";
            break;
        case "gw":
        case "gnw":
        case "game n watch":
        case "game & watch":
        case "game&watch":
        case "mr. game n watch":
        case "mr. game & watch":
        case "mr. game&watch":
        case "mr game n watch":
        case "mr game & watch":
        case "mr game&watch":
            series = "gw";
            break;
        default:
            return null;
    }

    return series + "_" + color;
}

function concatLocation(bracketLocation, bestOf) {
    if (bestOf > 0) {
        return bracketLocation + " (Best of " + bestOf + ")";
    }
    return bracketLocation;
}

function getTwitter(twitter) {
    if (twitter.length == 0) {
        return "";
    }

    if (twitter.charAt(0) == "@") {
        return twitter;
    }
    return "@" + twitter;
}

function getCountry(country) {
    var res = iso.findCountryByName(country);
    if (!res) {
        res = iso.findCountryByCode(country);
    }

    if (res) {
        return '<img src="images/GoSquared/cropped/iso/64shiny/'+ res["value"] +'.png" width="43" height="28">';
    } else {
        return null;
    }
}
