function startNewGame(){
   disableCommandInput()
   consoleLoadingAnimation();
}

//loading Animation Method
function consoleLoadingAnimation(){
  //Define ques and animations
  var loadingAnimationQue = new AnimationQueue();
  var failSafeStartAnimation = new ConsoleTextLoadingAnimationTyping(4000, 230, "Starting Failsafe", 4, true, 500);
  //Completion Text animation
  var partiallyCompleteFailsafeText = "Failsafe partially completed.";
  var failSafePartiallyCompleteAnimation = new ConsoleTextTypingAnimation(100, partiallyCompleteFailsafeText);

  //Add Animations to que
  loadingAnimationQue.addAnimation(failSafeStartAnimation, 2000);
  loadingAnimationQue.addAnimation(failSafePartiallyCompleteAnimation, 500);
  //Start animationQue
  loadingAnimationQue.start();
}

function printConsoleCopyright(){
  printOnConsole("\u00A9 2015 BumBumGame Corp.");
  printOnConsole("Alle Rechte vorbehalten");
  printOnConsole(""); //EmptyLine
  printOnConsole("Für eine Liste an Befehlen schreiben sie [help]");
  printOnConsole(""); //EmptyLine
}

startNewGame();
