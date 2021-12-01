//Functions for CommandExecution (Return null if no out to the console is needed) (Return Array of Strings for Answer: Each element = one line)
//clear function
function executeClearConsole(command, executingConsole){
   executingConsole.clearCommandLog();
   return null;
}

//function that displays help Dialog
function showHelpDialog(command){
  //Split Command into Parameters
  var commandParameters = command.split(" ");
  //Define Output array
  var outputArray;

  //Print Command list if no Argument is given
  if(commandParameters.length <= 1){
  //define normal Start output
   outputArray = localCommands.getCommandDescription(localCommands.getCommandIndex("help"));
   outputArray.push("");//Empty line

   //Print each first line
   //First print local commands
    for(var i = 0; i < localCommands.localCommandCount; i++){
      outputArray.push(localCommands.getCommandAlias(i) + ": ");
      outputArray.push("    " +localCommands.getFirstLineOfCommandDescription(i));
      //Push Empty line
      outputArray.push("");
    }

    //Second Print ServerCommands

  }else{
    //Take second Command and try to identify command and show Full description
    //First Check local Commands
    var secondCommandIndex = localCommands.getCommandIndex(commandParameters[1]);

    if(secondCommandIndex != -1){
       //Second command found locally
       outputArray = localCommands.getCommandDescription(secondCommandIndex);
    }else{
      //Check Server Commands
      outputArray = ["Befehl '"+ commandParameters[1] +"' nicht gefunden!"];
    }

  }

   //return Console output
   return outputArray;
}
