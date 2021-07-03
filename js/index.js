//important Vars
var optionsSection = document.getElementById("optionsSection");
var mainPageButtons = document.getElementById("firstButtons");
var loginForm = document.getElementById("gameLoginForm");
var newGameLoadingPage = document.getElementById("newLoadingPage");
var forgotPasswordForm = document.getElementById("forgotPasswordForm");

//Button vars
var goToLoginButton = document.getElementById("goToLoginButton");
var goBackFromLoginButton = document.getElementById("goToMainPageFromLoginButton");
var goToNewGameButton = document.getElementById("goToNewGameButton");
var goBackFromNewGameButton = document.getElementById("goToMainPageFromNewGameButton");
var goToPasswordForgotButton = document.getElementById("goToPasswordForgotButton");
var goBackFromForgotButton = document.getElementById("goBackToLoginFromForgotButton");

//Current UrlParameters
const urlParameters = new URLSearchParams(window.location.search);

var closeTabButton = document.getElementById("closeTabButton");

var animationTiming = 900; //in ms (transition time + 100ms)

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
         loadPageOnSiteLoad(newLoadingPage);
				 break;
			}

	}

}

function setPageParameter(pageParameter){
	 urlParameters.set("startPage" , pageParameter);
   var newUrl = location.protocol + "//" + location.host + location.pathname + "?" + urlParameters.toString();

	 history.pushState({}, "", newUrl);
}

goToLoginButton.addEventListener("click", transitionFromMainPageToGameLogin);
goBackFromLoginButton.addEventListener("click", transitionFromGameLoginToMainPage);
goToNewGameButton.addEventListener("click", transitionFromMainPageToNewGamePage);
goBackFromNewGameButton.addEventListener("click", transitionFromNewGamePageToMainPage);
goToPasswordForgotButton.addEventListener("click", transitionFromGameLoginToPasswordForgot);
goBackFromForgotButton.addEventListener("click", transitionFromPasswordForgotToGameLogin);
closeTabButton.addEventListener("click", closeTab);

//Set startPage on loading
setStartPage();
