function QQQuizzAppController (json) {
    this.model = new QQQuizzAppModel(eval("(" + json + ")"));
    this.templatesManager = new TemplatesManager();
    this.initListeners();
    this.currentQuizz = null;
    this.currentQuestion = null;
    this.utterance = new SpeechSynthesisUtterance();
    //this.utterance.lang = 'es-ES';
    this.audioOKElement = null;
    this.audioKOElement = null;
}

QQQuizzAppController.CONTAINER_DIV_ID = "#container";
QQQuizzAppController.HOME_DIV_ID = "#home";
QQQuizzAppController.QUIZZ_DIV_ID = "#quizz";
QQQuizzAppController.QUESTION_DIV_ID = "#question";

QQQuizzAppController.DEFAULT_LANG = "es-ES";


QQQuizzAppController.prototype.initListeners = function() {
	var that = this;//para poder hacer referencias desde las inner functions
	$(QQQuizzAppController.CONTAINER_DIV_ID).on('click', '.img-home', function(event) {
		event.preventDefault();//para que no ejecute el enlace
		if (that.audioOKElement == null || that.audioKOElement == null) {
			that.createAudios();
		}
		var quizzIndex = $(this).attr('quizz-index');
		that.currentQuizz = that.model.quizzes[quizzIndex];
		that.playQuizz(that.currentQuizz);
	});
	$(QQQuizzAppController.CONTAINER_DIV_ID).on('click', '.img-answer', function(event) {
		var clickedElement = this;
		event.preventDefault();//para que no ejecute el enlace
		var answerIndex = $(this).attr('answer-index');
		that.utterance.text = $(this).attr('title');
		that.utterance.onend = function(event) {
			that.checkAnswer(that.currentQuestion.answers[answerIndex], clickedElement);
			//para vaciar el onend y que no se ejecute el ckechanswer después de leer cualquier texto
			that.utterance.onend = function(event) {
				//console.log("onend vacío");
			};				
		};				
		var lang = $(clickedElement).attr('lang');
		if (lang != undefined && lang != "") {
			that.utterance.lang = lang;
		} else {
			that.utterance.lang = QQQuizzAppController.DEFAULT_LANG;
		}
		window.speechSynthesis.speak(that.utterance);	
	});
	$(QQQuizzAppController.CONTAINER_DIV_ID).on('click', '.glyphicon-home', function(event) {
		event.preventDefault();//para que no ejecute el enlace
		that.home(true);	
	});
	$(QQQuizzAppController.CONTAINER_DIV_ID).on('click', '.home-buton', function(event) {
		that.home(true);	
	});
	$(QQQuizzAppController.CONTAINER_DIV_ID).on('click', '#nextButton', function(event) {
		that.makeQuestion();	
	});
	$(QQQuizzAppController.CONTAINER_DIV_ID).on('click', '.speakable', function(event) {
		event.preventDefault();//para que no ejecute el enlace
		that.utterance.text = $(this).text();
		var lang = $(this).attr('lang');
		if (lang != undefined && lang != "") {
			that.utterance.lang = lang;
		} else {
			that.utterance.lang = QQQuizzAppController.DEFAULT_LANG;
		}
		window.speechSynthesis.speak(that.utterance);	
	});
};

 
QQQuizzAppController.prototype.home = function(reloadQuestions) {
	var that = this;
	var loadingDivId = this.preLoading(QQQuizzAppController.CONTAINER_DIV_ID);
	if (reloadQuestions) {
		this.model = new QQQuizzAppModel(eval("(" + json + ")"));//para que tenga todas las preguntas de nuevo
	}
	if ($(QQQuizzAppController.HOME_DIV_ID).length) {
		this.postLoading(loadingDivId);
	} else {
		this.templatesManager.getHtml(
			//"home.html",
			"home",
			this.model,
			function(html) {
				$(QQQuizzAppController.CONTAINER_DIV_ID).append(html);
				that.postLoading(loadingDivId);
			},
			this.error
		);	
	}
};

QQQuizzAppController.prototype.playQuizz = function(quizz) {
	var that = this;
	var loadingDivId = this.preLoading(QQQuizzAppController.CONTAINER_DIV_ID);
	$(QQQuizzAppController.QUIZZ_DIV_ID).remove();//borra un posible elemento quizz que hubiera en el html
	this.templatesManager.getHtml(
		//"quizz.html",
		"quizz",
		quizz,
		function(html) {
			$(QQQuizzAppController.CONTAINER_DIV_ID).append(html);
			that.postLoading(loadingDivId);
			that.makeQuestion();
		},
		this.error
	);	
};

QQQuizzAppController.prototype.makeQuestion = function() {
	var that = this;
	var question = this.currentQuizz.getRandomQuestion();
	this.currentQuestion = question;
	$("#nextButton").prop("disabled", !this.currentQuizz.hasMoreQuestions());
	$(QQQuizzAppController.QUESTION_DIV_ID).html("");//borra el contenido de un posible elemento question que hubiera en el html	
	var loadingDivId = this.preLoading(QQQuizzAppController.QUESTION_DIV_ID);
	this.templatesManager.getHtml(
		//"question.html",
		"question",
		question,
		function(html) {
			$(QQQuizzAppController.QUESTION_DIV_ID).append(html);
			that.postLoading(loadingDivId);
		},
		this.error
	);	
};

QQQuizzAppController.prototype.end = function() {
	var that = this;
	var loadingDivId = this.preLoading(QQQuizzAppController.CONTAINER_DIV_ID);
	this.templatesManager.getHtml(
		//"end.html",
		"end",
		null,
		function(html) {
			$(QQQuizzAppController.CONTAINER_DIV_ID).append(html);
			that.postLoading(loadingDivId);
		},
		this.error
	);	
};

QQQuizzAppController.prototype.checkAnswer = function(answer, imgElement) {
	var that = this;
	if (answer.correct) {
		this.audioOKElement.play();
		imgElement.src = "img/ok.jpg";
		//console.log("$(#audioOk).length: " + $("#audioOk").length);
		//$("#audioOk").play();//este dice "Undefined is not a function"
		//document.getElementById('audioOk').play();
		//this.audioElement.src = "resources/aplausos.mp3";
		//this.audioElement.play();
		setTimeout(function() {
			if (that.currentQuizz.hasMoreQuestions()) {
				that.makeQuestion();	
			} else {
				that.end();
			}
		}, 2000);
	} else {
		console.log("this.audioKOElement.src: " + this.audioKOElement.src);
		this.audioKOElement.play();
		imgElement.src = "img/ko.jpg";
		//console.log("$(#audioKO).length: " + $("#audioKO").length);
		//$("#audioKO").play();//este dice "Undefined is not a function"
		//document.getElementById('audioKO').play();
		//this.audioElement.src = "resources/error.mp3";
		//this.audioElement.play();
		setTimeout(function() {
			imgElement.src = answer.img;
		}, 2000);
	}
};

QQQuizzAppController.prototype.preLoading = function(divId) {
	var loadingDivId = "loading-" + getRandomString(5);
	var html = '';
	html += '<div class="page" id="' + loadingDivId + '">';
	html += '	Loading...';
	html += '</div>';
	$(divId).html(html);
	return "#" + loadingDivId;
};

QQQuizzAppController.prototype.postLoading = function(loadingDivId) {
	$(loadingDivId).addClass("hide");
	if ($('#autospeak').length) {
		var lang = $('#autospeak').attr('lang');
		if (lang != undefined && lang != "") {
			this.utterance.lang = lang;
		} else {
			this.utterance.lang = QQQuizzAppController.DEFAULT_LANG;
		}
		this.utterance.text = $('#autospeak').text();
		window.speechSynthesis.speak(this.utterance);
	}	
	
};

//TODO hacer algo más interesante
QQQuizzAppController.prototype.error = function(error) {
	console.log(error);
};

//lo tengo que hacer así por restricciones de android que no deja reproducir un audio si no es por acción directa del usuario
//http://mauricebutler.wordpress.com/2014/02/22/android-chrome-does-not-allow-applications-to-play-html5-audio-without-an-explicit-action-by-the-user/
//http://blog.foolip.org/2014/02/10/media-playback-restrictions-in-blink/
QQQuizzAppController.prototype.createAudios = function(error) {
	console.log("Creando elementos de audio");
	this.audioOKElement = document.createElement('audio');
	this.audioOKElement.load();
	//this.audioOKElement.addEventListener("load", function() { 
  		this.audioOKElement.play(); 
  		this.audioOKElement.pause();
  		this.audioOKElement.src = "resources/aplausos.mp3";
  		this.audioOKElement.load();
	//}); 
	
	this.audioKOElement = document.createElement('audio');
	this.audioKOElement.load();
	//this.audioKOElement.addEventListener("load", function() { 
  		this.audioKOElement.play(); 
  		this.audioKOElement.pause();
  		this.audioKOElement.src = "resources/error.mp3";
  		this.audioKOElement.load();
	//});	
};