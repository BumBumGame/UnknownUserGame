function startNewGame(){
   disableCommandInput()
   consoleLoadingAnimation();
}

//Starts different animations with right timing for Console loading
function consoleLoadingAnimation(){



}



function printConsoleCopyright(){
  printOnConsole("\u00A9 2015 BumBumGame Corp.");
  printOnConsole("Alle Rechte vorbehalten");
  printOnConsole(""); //EmptyLine
  printOnConsole("Für eine Liste an Befehlen schreiben sie [help]");
  printOnConsole(""); //EmptyLine
}

startNewGame();
