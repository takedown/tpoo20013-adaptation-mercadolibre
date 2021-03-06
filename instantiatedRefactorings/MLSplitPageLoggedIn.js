var metadata = {"author":"Veronica Murga - Sergio Firmenich ", "name":"SplitPage para Mercado Libre usuario logeado", "description":"...","id":"splitPage-mainMercadoLibre-loggedin-vmurga-sfirmenich"};

function getAccessibilityAugmenter(){
	return new MercadoLibreListSplitWrapper();
};

function MercadoLibreListSplitWrapper(){
	this.logeado = true;
}

MercadoLibreListSplitWrapper.prototype = new AbstractInstanceRefactoring();

MercadoLibreListSplitWrapper.prototype.setTargetURLs = function(){
	this.addTargetURL(/http:\/\/www.mercadolibre.com.ar/);
	this.addExcludedURL(/http:\/\/www.mercadolibre.com.ar\/inmuebles\//);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/ml.myAccount.facturacion/);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/ml.feedback.app.NewFeedback/);
	this.addExcludedURL(/www.mercadolibre.com.ar\/jm\/myML?as_section=AIMED_IT/);
	this.addExcludedURL(/https:\/\/myaccount.mercadolibre.com.ar\/bookmarks\/list#/);
	this.addExcludedURL(/syi.mercadolibre.com.ar\/sell\/sell[.]*/);


	
};

function checkLogin(nombre, doc) {
	var lista = doc.cookie.split(";");
	var valor = undefined;
	var micookie = undefined;
	var log = false;
	
	for (i in lista) {
		var busca = lista[i].search(nombre);
		if (busca > -1) { micookie=lista[i] }
	}
	if (typeof micookie != 'undefined'){
		var igual = micookie.indexOf("=");
		valor = micookie.substring(igual+1);
		if (valor == 0)
			log = false;
		else
			log = true;
	} else
		log = false;
	return log;
}

MercadoLibreListSplitWrapper.prototype.adaptDocument = function(doc){
	this.logeado = checkLogin('orgnickp', doc);
	if (this.logeado)
      this.abstract_refactoring.adaptDocument(doc);
};

MercadoLibreListSplitWrapper.prototype.initialize = function(language){

	this.refactoring = new SplitPage.SplitPage("MercadoLibre home");
	

	var menu = new SplitPage.SplitedSection('Busqueda',this.refactoring);		
	menu.addElement("/html/body/header/div/a/h1");
	menu.addElement("//*[@id='formSearch']");
	menu.addElement("//html/body/header/div/nav/ul");
	menu.addElementForRemoving("//*[@id='account']");
	menu.addElementForRemoving("//*[@id='notification']");
	menu.addElementForRemoving("//*[@id='favorite']");
	menu.addElementForRemoving("//*[@id='sellBtn']");
	menu.addElementForRemoving("/html/body/header/div/nav/ul/li[7]");
	
	var destacados = new SplitPage.SplitedSection("Destacados",this.refactoring);		
	destacados.addElement('/html/body/main/section[4]/div[3]');
		
	var categorias = new SplitPage.SplitedSection("Categorias",this.refactoring);		
	categorias.addElement('/html/body/main/section/div/div[2]/div[2]');
	
	var clasificados = new SplitPage.SplitedSection("Clasificados",this.refactoring);		
	clasificados.addElement('//*[contains(@class,"ch-g1-5")]');
	clasificados.addElementForRemoving('/html/body/footer');
	clasificados.addElement('//*[contains(@class,"ch-g1-4")]');// xPath cuando se agrega el historial del usuario...
	
    var logout = new SplitPage.StaticLink("Salir", "https://www.mercadolibre.com.ar/jm/logout");
	this.refactoring.addSplitedSection(logout);
	
	var miCuenta = new SplitPage.StaticLink("Mi cuenta", "https://www.mercadolibre.com.ar/jm/myML");
	this.refactoring.addSplitedSection(miCuenta);
	
    var sell = new SplitPage.StaticLink("Vender", "https://syi.mercadolibre.com.ar/sell");
	this.refactoring.addSplitedSection(sell);
		
	menu.addStaticLink(logout);
	menu.addStaticLink(miCuenta);
	menu.addStaticLink(sell);

	this.refactoring.addSplitedSection(menu);
	this.refactoring.addSplitedSection(destacados);
	this.refactoring.addSplitedSection(categorias);
	this.refactoring.addSplitedSection(clasificados);
	
	//Si queres que se renderiza automáticamente una de las secciones:
	this.refactoring.setAsMain(menu);
    this.refactoring.setAsFirstSplitedSection();

	this.abstract_refactoring = this.refactoring;
	

};

MercadoLibreListSplitWrapper.prototype.initRefactoringForPageLoaded = function(doc,language){
};