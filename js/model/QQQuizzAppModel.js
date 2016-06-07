function QQQuizzAppModel (jsonArray) {
	this.randomQuizz = new QQQuizz();
    this.randomQuizz.title = "Aleatorio";
    this.randomQuizz.img = "img/random.jpg";
    this.randomQuizz.questions = new Array();
	
	this.quizzes = new Array();
	for (var i=0; i<jsonArray.length; i++) {
		this.quizzes.push(new QQQuizz(jsonArray[i], this.randomQuizz));	
	}
	this.quizzes.push(this.randomQuizz);
	
	console.log("[QQQuizzAppModel]this.randomQuizz.questions.length:" + this.randomQuizz.questions.length);
}
 
QQQuizzAppModel.prototype.quizzes = null;//Array 
