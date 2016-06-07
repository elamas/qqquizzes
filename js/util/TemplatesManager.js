function TemplatesManager () {
	this.templateContents = new Array();//array "asociativo". La claves es el nombre de archivo del template
}
 
TemplatesManager.prototype.templateContents = null; 
TemplatesManager.prototype.getTemplateContent = function(fileName, onSuccess, onError) {
	var templateContent = this.templateContents[fileName];
	if (templateContent != null) {
		//console.log("[TemplatesManager] retrieving content from cache");
		onSuccess(templateContent);
	} else {
		//console.log("[TemplatesManager] retrieving content from file");
		//alert("this.templateContents: " + this.templateContents);
		//alert("this.templateContents.length: " + this.templateContents.length);
		//he tenido que poner esta variable que no copia, sino que es una referencia para poder usarla desde dentro del $.ajax
		/*
		var templateContents = this.templateContents;
		$.ajax({
			url : "templates/" + fileName,
			cache : false,
			success : function(data) {
				//alert("this.templateContents: " + this.templateContents);
				//alert("templateContents: " + templateContents);
				//this.templateContents[fileName] = data;
				templateContents[fileName] = data;
				onSuccess(data);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert("thrownError: " + thrownError);
				onError(thrownError);
		    },
		   crossDomain: true
		});
		*/
		var data = $("#" + fileName + "-template").html();
		//console.log("[TemplatesManager]#fileName: " + ("#" + fileName));
		//console.log("[TemplatesManager]data: " + data);
		this.templateContents[fileName] = data;
		onSuccess(data);
	}
};

TemplatesManager.prototype.getHtml = function(fileName, theObject, onSuccess, onError) {
	this.getTemplateContent(
		fileName,
		function(data) {
			//alert("this.templateContents: " + this.templateContents);
			var templateCompiled = Handlebars.compile(data);
			var html = templateCompiled(theObject);
			onSuccess(html);
		},
		onError		
	);
};