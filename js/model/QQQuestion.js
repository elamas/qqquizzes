/*
{
	"title": "¿Qué animal hace miau?",
	"lang": "",
	"answers": [
		{
			"title": "Perro",
			"lang": "",
			"img": "",
			"correct": false
		},
		...
	]
} 
 */
function QQQuestion (jsonObject) {
    this.title = jsonObject.title;
    this.lang = jsonObject.lang;
    if (jsonObject.answers != 'undefined') {
    	this.answers = new Array();
    	for (var i=0; i<jsonObject.answers.length; i++) {
    		this.answers.push(new QQAnswer(jsonObject.answers[i]));	
    	}
    }
}
 
QQQuestion.prototype.title = null;
QQQuestion.prototype.lang = null;
QQQuestion.prototype.answers = null;//Array 
