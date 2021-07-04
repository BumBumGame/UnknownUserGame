//Klass that holds all Local Command defintitions----------------------------------------------------------------------
class localCommandDefinition{
localCommandStartAlias;
localCommandDescriptions;
localCommandFunction;

constructor(){
  //init Arrays
   this.localCommandStartAlias = [];
   this.localCommandDescriptions = [];
   this.localCommandFunction = [];
  //Add Commands
  this.addAllLocalCommands();
}
//Adds Command to Local Command definition
addComand(commandStartAlias, commandDescritption, commandFunction){
  this.localCommandStartAlias.push(commandStartAlias.trim().toLowerCase());
  this.localCommandDescriptions.push(commandDescritption.trim());
  this.localCommandFunction.push(commandFunction);
}

//Function that returns the Index of a Specific Command based on its Alias. Returns -1 of no Command is found
getCommandIndex(command){
 var currentCommandStartAlias = command.split(" ")[0];
 return this.localCommandStartAlias.indexOf(currentCommandStartAlias.trim().toLowerCase());
}

//Function that returns the current count of local Commands
get localCommandCount(){
  return this.localCommandStartAlias.length;
}

getLocalCommandAlias(commandIndex){
  return this.localCommandStartAlias[commandIndex];
}

getLocalCommandDescription(commandIndex){
  var descriptionArray = this.localCommandDescriptions[commandIndex].split("\n");

  return descriptionArray;
}

getFirstLineOfCommandDescription(commandIndex){
  return this.localCommandDescriptions[commandIndex].split("\n")[0];
}

//Function that executes the a Command Based on their Alias. @Returns null if not successfull. @Returns Answer Array if successfull
executeCommandFunction(command){
var commandIndex = this.getCommandIndex(command);
//If Command not found then return null
if(commandIndex == -1){
 return null;
}

var commandResponse = this.localCommandFunction[commandIndex](command);

if(commandResponse == null){
 //Return empty response Array
 var emptyResponseArray = [];
 return emptyResponseArray;
}

//Return response Array
return commandResponse;
}

//Function where all local Commands get added to List
addAllLocalCommands(){
  //Add clear Command
 this.addComand("clear", "Löscht den Kompletten Kommando-Log.", executeClearConsole);
 //Add help Command
 this.addComand("help", "Zeigt eine Liste der Verfügbaren Commands mit ihrer Beschreibung an. \n"
                      + "Um genauere Informationen über einen Befehl zu erhalten schreiben sie: help [Befehl].", showHelpDialog);
}

}

//Class that is used to process Commands-------------------------------------------------------------------------------------------
class commandProcessor{
//Object that contains all Command definitions
localCommandDefinition;

//Current command Answer variable
currentCommandAnswer;

//current Command
currentCommand;

constructor(command){
  //Save Command to Datafield
 this.currentCommand = command.toLowerCase().trim();
 //Create Command Definition Object
 this.localCommandDefinition = new localCommandDefinition();
 //Standard init CommandAnswer
 this.currentCommandAnswer = null;
}

processCommand(){
  var currentCommandResponse = this.localCommandDefinition.executeCommandFunction(this.currentCommand);
  //Check if Command exists local
  if(currentCommandResponse != null) {
    //If he does exist
     //Check if Command send Response
     if(currentCommandResponse.length != 0){
       this.currentCommandAnswer = currentCommandResponse;
     }

  }else{
    //Send Command to Server
  }

}
//Get Method for CommandAnswer
get commandResponse(){
    return this.currentCommandAnswer;
}

}

//Functions for CommandExecution (Return null if no out to the console is needed) (Return Array of Strings for Answer: Each element = one line)
//clear function
function executeClearConsole(command){
   clearCommandLog();
   return null;
}

//function that displays help Dialog
function showHelpDialog(command){
  //Split Command into Parameters
  var commandParameters = command.split(" ");
  //Get Current Command Defintion
  var localCommands = new localCommandDefinition();
  //Define Output array
  var outputArray;

  //Print Command list if no Argument is given
  if(commandParameters.length <= 1){
  //define normal Start output
   outputArray = localCommands.getLocalCommandDescription(localCommands.getCommandIndex("help"));
   outputArray.push("");//Empty line

   //Print each first line
   //First print local commands
    for(var i = 0; i < localCommands.localCommandCount; i++){
      outputArray.push(localCommands.getLocalCommandAlias(i) + ": ");
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
       outputArray = localCommands.getLocalCommandDescription(secondCommandIndex);
    }else{
      //Check Server Commands
      outputArray = ["Befehl '"+ commandParameters[1] +"' nicht gefunden!"];
    }

  }

   //return Console output
   return outputArray;
}
