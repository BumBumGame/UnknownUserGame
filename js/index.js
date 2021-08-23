//Current UrlParameters
var urlParameters = new URLSearchParams(window.location.search);

var closeTabButton = document.getElementById("closeTabButton");

var animationTiming = 900; //in ms (transition time + 100ms)

//Current loaded Slide
var currentSlide;

//Switches From Main Page To Loginpage with an Animation
function transitionFromMainPageToGameLogin(){
	transitionFromTo(mainPageButtons, loginForm);
	setPageParameter("login");
}

//Switches from LoginPage to MainPage with an animation
function transitionFromGameLoginToMainPage(){
	transitionFromTo(loginForm, mainPageButtons);
	setPageParameter("MainPage");
}

function transitionFromMainPageToNewGamePage(){
	transitionFromTo(mainPageButtons, newGameLoadingPage);
	setPageParameter("NewGame");
}

function transitionFromNewGamePageToMainPage(){
	transitionFromTo(newGameLoadingPage, mainPageButtons);
	setPageParameter("MainPage");
}

function transitionFromGameLoginToPasswordForgot(){
	transitionFromTo(loginForm, forgotPasswordForm);
	setPageParameter("forgotPass");
}

function transitionFromPasswordForgotToGameLogin(){
	transitionFromTo(forgotPasswordForm, loginForm);
	setPageParameter("login");
}

function closeTab(){
	if(confirm("Wollen sie diesen Tab wirklich schließen?")){
		window.close();
	}
}

function transitionFromTo(startPage, endPage){
	optionsSection.style.marginLeft = "100%";

	setTimeout(function () {
	startPage.style.display = "none";
    endPage.style.display = "block";
	optionsSection.removeAttribute("style");
	}, animationTiming);
}

//Switches to Parameter Site directly on Page load
function loadPageOnSiteLoad(pageToLoad){
  mainPageButtons.style.display = "none";
	pageToLoad.style.display = "block";
}

function setStartPage(){
	//Check if needed get-Parameter exists
	if(urlParameters.has("startPage")){

		 //Switch according to get Parameter
		 //Only switch to Forgot Passwort and login every other one go to main page
			switch(urlParameters.get("startPage")){
         case "login":
         loadPageOnSiteLoad(loginForm);
				 break;

				 case "forgotPass":
         loadPageOnSiteLoad(forgotPasswordForm);
				 break;

				 case "NewGame":
         loadPageOnSiteLoad(newGameLoadingPage);
				 startGlitchTimer();
				 break;
			}

			currentSlide = urlParameters.get("startPage");

	}else{
		currentSlide = "MainPage";
	}

}

//Function to transition to a page after an url change
function onUrlChange(e){
	//Prevent default behaviour
	e.preventDefault();
	//Get new Url Parameters
	urlParameters = new URLSearchParams(window.location.search);
	//Check if get Parameter exists and extract Data
	var urlPageParameter;

	if(urlParameters.has("startPage")){
    urlPageParameter = urlParameters.get("startPage");
	}else{
		//Set to home
		urlPageParameter = "MainPage";
	}

	//transition to url Slide from CurretnSlide
	 //Only if they are not the same
	  if(currentSlide == urlPageParameter){
			 return;
		}
   //Get Slide Objects
		var fromPage = getObjectFromPageParameter(currentSlide);
		var toPage = getObjectFromPageParameter(urlPageParameter);

		//Check for timer setting
		if(fromPage === newGameLoadingPage){
      abortGlitch();
		}

		if(toPage === newGameLoadingPage){
			startGlitchTimer();
		}

   //Update currentSlide
	 currentSlide = urlPageParameter;
	 //Transition from to
   transitionFromTo(fromPage, toPage);
}

//Function to get an object according to url Parameter
function getObjectFromPageParameter(pageParameter){
   switch(pageParameter){
		 case "login":
 		return loginForm;
 		break;

 		case "forgotPass":
 		return forgotPasswordForm;
 		break;

 		case "NewGame":
    return newGameLoadingPage;
 		break;

		case "MainPage":
		return mainPageButtons;
		break;

		default:
		return null;
		break;
	 }
}

function setPageParameter(pageParameter){
	 urlParameters.set("startPage" , pageParameter);
   var newUrl = location.protocol + "//" + location.host + location.pathname + "?" + urlParameters.toString();

	 //Set currentSlide
	 currentSlide = pageParameter;

	 history.pushState({}, "", newUrl);
}

goToLoginButton.addEventListener("click", transitionFromMainPageToGameLogin);
goBackFromLoginButton.addEventListener("click", transitionFromGameLoginToMainPage);
goToNewGameButton.addEventListener("click", transitionFromMainPageToNewGamePage);
goBackFromNewGameButton.addEventListener("click", transitionFromNewGamePageToMainPage);
goToPasswordForgotButton.addEventListener("click", transitionFromGameLoginToPasswordForgot);
goBackFromForgotButton.addEventListener("click", transitionFromPasswordForgotToGameLogin);
closeTabButton.addEventListener("click", closeTab);

//Add event Listener for url Change
window.addEventListener("popstate", onUrlChange);

//Set startPage on loading
setStartPage();
