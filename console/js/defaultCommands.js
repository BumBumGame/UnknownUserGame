/**
* Function that displays help Dialog
* @param {String} command command which has been put in the console
* @param {InGameConsole} executingConsole console Object which the command has been executed on
**/
function showHelpDialog(command, executingConsole){
  //Split Command into Parameters
  let commandParameters = command.split(" ");
  //Define Output array
  let outputArray = [];

  //Print Command list if no Argument is given
  if(commandParameters.length <= 1){
  //define normal Start output
   outputArray = executingConsole.currentActiveCommandDefinition.getCommandDescription(executingConsole.currentActiveCommandDefinition.getCommandIndex("help"));
   outputArray.push("");//Empty line

   //Print each first line
   //First print local commands
    for(var i = 0; i < executingConsole.currentActiveCommandDefinition.length; i++){
      outputArray.push(executingConsole.currentActiveCommandDefinition.getCommandAlias(i) + ": ");
      outputArray.push("    " + executingConsole.currentActiveCommandDefinition.getFirstLineOfCommandDescription(i));
      //Push Empty line
      outputArray.push("");
    }

    //Second Print ServerCommands
    // TODO: Add ServerCode
  }else{
    //Take second Command and try to identify command and show Full description
    //First Check local Commands
    var secondCommandIndex = executingConsole.currentActiveCommandDefinition.getCommandIndex(commandParameters[1]);

    if(secondCommandIndex != -1){
       //Second command found locally
       outputArray = executingConsole.currentActiveCommandDefinition.getCommandDescription(secondCommandIndex);
    }else{
      //Check Server Commands
      outputArray = ["Befehl '"+ commandParameters[1] +"' nicht gefunden!"];
    }

  }

   //return Console output
   return outputArray;
}

/**
* Command function which clears the consoleLog
* @param {String} command command which has been put in the console
* @param {InGameConsole} executingConsole console Object which the command has been executed on
**/
function executeClearConsole(command, executingConsole){
   executingConsole.clearCommandLog();
   return null;
}

//-----Add default Commands:--------------------------------------------------------------------------------------------
//Add help Command
DefaultCommands.addCommandToDefaults(new Command("help", "Zeigt eine Liste der Verfügbaren Commands mit ihrer Beschreibung an. \n"
                   + "Um genauere Informationen über einen Befehl zu erhalten schreiben sie: help [Befehl].", showHelpDialog));

DefaultCommands.addCommandToDefaults(new Command("clear", "Löscht den Kompletten Kommando-Log.", executeClearConsole));
