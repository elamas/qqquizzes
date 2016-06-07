//http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
function getRandomString(numChars) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < numChars; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function getRandom(inf,sup){
	var numPosibilities = sup - inf;
	var rnd = Math.random() * numPosibilities;
	rnd = Math.round(rnd);
	return parseInt(inf) + rnd;
}

