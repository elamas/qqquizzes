/*
{
	"title": "Gallo",
	"lang": "",
	"img": "",
	"correct": false
} 
 */
function QQAnswer (jsonObject) {
    this.title = jsonObject.title;
    this.lang = jsonObject.lang;
    this.img = jsonObject.img;
    this.correct = jsonObject.correct;
}
 
QQAnswer.prototype.title = null;
QQAnswer.prototype.lang = null;
QQAnswer.prototype.img = null;
QQAnswer.prototype.correct = null; 
