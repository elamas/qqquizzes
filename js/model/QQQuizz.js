/*
{
	"title": "Animales",
	"lang": "",
	"img": "",
	"questions": [
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
		},
		...
	]
} 
 */
function QQQuizz (jsonObject, randomQuizz) {
	if (jsonObject != null) {//porque una vez le llamo sin parámetros para el aleatorio
	    this.title = jsonObject.title;
	    this.lang = jsonObject.lang;
	    this.img = jsonObject.img;
	    if (jsonObject.questions != 'undefined') {
	    	this.questions = new Array();
	    	for (var i=0; i<jsonObject.questions.length; i++) {
	    		var question = new QQQuestion(jsonObject.questions[i]);
	    		this.questions.push(question);	
	    		randomQuizz.questions.push(question);
	    	}
	    }
   }
}

QQQuizz.prototype.title = null;
QQQuizz.prototype.lang = null;
QQQuizz.prototype.img = null;
QQQuizz.prototype.questions = null;//Array
 
QQQuizz.prototype.getRandomQuestion = function() {
	var rndQuestionIndex = getRandom(0, this.questions.length - 1);
	var question = this.questions[rndQuestionIndex];
	this.questions.splice(rndQuestionIndex, 1);//la elimino del array
	return question;
};

QQQuizz.prototype.hasMoreQuestions = function() {
	return this.questions.length > 0;
};