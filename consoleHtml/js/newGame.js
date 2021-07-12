function startNewGame(){
   disableCommandInput()
   consoleLoadingAnimation();
}

//loading Animation Method
function consoleLoadingAnimation(){
  //Define ques and animations
  var loadingAnimationQue = new AnimationQueue();
  var failSafeStartAnimation = new ConsoleTextLoadingAnimationTyping(5000, 300, "Starting Failsafe", 5, true, 1000);
  //Completion Text animation
  var partiallyCompleteFailsafeText = "Failsafe partially completed.";
  var failSafePartiallyCompleteAnimation = new ConsoleTextTypingAnimation(1000, partiallyCompleteFailsafeText);

  //Add Animations to que
  loadingAnimationQue.addAnimation(failSafeStartAnimation);
  loadingAnimationQue.addAnimation(failSafePartiallyCompleteAnimation, 300);
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
