var glitchTimer;
const disableGlitchTimerDebug = true;

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

function  removeDisplayAnimation(){

}

function disableGoingBackButtons(){
  goBackFromNewGameButton.removeEventListener("click", abortGlitch);
  goBackFromNewGameButton.removeEventListener("click", transitionFromNewGamePageToMainPage);
  window.removeEventListener("popstate", onUrlChange);
}

goToNewGameButton.addEventListener("click", startGlitchTimer);
goBackFromNewGameButton.addEventListener("click", abortGlitch);
