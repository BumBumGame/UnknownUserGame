var glitchTimer;
const disableGlitchTimerDebug = false;

function startGlitchTimer(){
  if(!disableGlitchTimerDebug){
  glitchTimer = setTimeout(enableGlitchEffect, 8000);
 }
}

function abortGlitch(){
 if(!disableGlitchTimerDebug){
  disableGlitchEffect();
  clearTimeout(glitchTimer);
  }
}

goToNewGameButton.addEventListener("click", startGlitchTimer);
goBackFromNewGameButton.addEventListener("click", abortGlitch);
