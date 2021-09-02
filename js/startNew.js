var glitchTimer;
const disableGlitchTimerDebug = false;

function startGlitchTimer(){
  if(!disableGlitchTimerDebug){
  glitchTimer = setTimeout(startGlitching, 8000);
 }
}

function abortGlitch(){
 if(!disableGlitchTimerDebug){
  disableGlitchEffect();
  clearTimeout(glitchTimer);
  }
}

function startGlitching(){
  enableGlitchEffect();
  //Set timeout for disablen The option to go back
  setTimeout(disableGoingBackButtons, 5000);
}

function disableDisplayAnimation(){
  var classNameAddOn = "gameLoginEndGlitch";

  if(mainScreenWindow.className.length == 0){
      classNameAddOn = " " + classNameAddOn;
  }

  mainScreenWindow.className += classNameAddOn;

  //Add event listener for Animation end
  mainScreenWindow.addEventListener("animationend", () => {
    mainScreenWindow.style.display = "none";}

  ) 
}

function disableGoingBackButtons(){
  goBackFromNewGameButton.removeEventListener("click", abortGlitch);
  goBackFromNewGameButton.removeEventListener("click", transitionFromNewGamePageToMainPage);
  window.removeEventListener("popstate", onUrlChange);
}

goToNewGameButton.addEventListener("click", startGlitchTimer);
goBackFromNewGameButton.addEventListener("click", abortGlitch);
