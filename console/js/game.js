function addAllLocalCommands(){
  //Add clear Command
 localCommands.addCommand("clear", "Löscht den Kompletten Kommando-Log.", executeClearConsole);
 //Add help Command
 localCommands.addCommand("help", "Zeigt eine Liste der Verfügbaren Commands mit ihrer Beschreibung an. \n"
                      + "Um genauere Informationen über einen Befehl zu erhalten schreiben sie: help [Befehl].", showHelpDialog);
}


addAllLocalCommands();
