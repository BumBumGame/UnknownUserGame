/**
*Class that holds all Command defintitions for a console----------------------------------------------------------------------
*/
class CommandDefinition{
localCommandStartAlias;
localCommandDescriptions;
localCommandFunction;

constructor(){
  //init Arrays
   this.localCommandStartAlias = [];
   this.localCommandDescriptions = [];
   this.localCommandFunction = [];
}
/**
*Adds Command to Local Command definition
* @param {String} commandStartAlias Alias that the command will be started with in the console input
* @param {String} commandDescritption A Description of the command (newline marked with /n)
* @param {String} commandFunction A reference to the function that will be executed with this command
*/
addCommand(commandStartAlias, commandDescritption, commandFunction){
  this.localCommandStartAlias.push(commandStartAlias.trim().toLowerCase());
  this.localCommandDescriptions.push(commandDescritption.trim());
  this.localCommandFunction.push(commandFunction);
}

/**
* Clears all of the Commands out of the Command definition
*/
clearAllCommands(){
  this.localCommandStartAlias = [];
  this.localCommandDescriptions = [];
  this.localCommandFunction = [];
}

/**
*Removes a Command
* @param {int} commandIndex Index of the command that shall be removed
*/
removeCommand(commandIndex){
  //Remove Element if found
  if(commandIndex != -1){
    localCommandStartAlias.splice(1, commandIndex);
    localCommandDescriptions.splice(1, commandIndex);
    localCommandFunction.splice(1, commandIndex);
  }else{
    throw "Error: Command not found in Defintition!";
  }

}

/**
*Function that returns the Index of a Specific Command based on its Alias. Returns -1 of no Command is found
* @param {String} command The comand of which index shall be searched for
* @return {int} Index of the Command, if not found -1
*/
getCommandIndex(command){
 var currentCommandStartAlias = command.split(" ")[0];
 return this.localCommandStartAlias.indexOf(currentCommandStartAlias.trim().toLowerCase());
}

/**
* Function that returns the current count of local Commands
* @return Count of all Commands in this Defintion
*/
get localCommandCount(){
  return this.localCommandStartAlias.length;
}

/**
* Functions returns Command Allias as String
* @param {int} commandIndex Index of the command which Alias shall be returned;
* @return {String} Alias to the requested Index
*/
getLocalCommandAlias(commandIndex){
  return this.localCommandStartAlias[commandIndex];
}

/**
* Function returns commandDescritption as an Array to @param Index of Command
* @param {int} commandIndex Index of the command
* @return {String:Array} Array of Strings that holds each line of an description seperately
*/
getLocalCommandDescription(commandIndex){
  var descriptionArray = this.localCommandDescriptions[commandIndex].split("\n");

  return descriptionArray;
}

/**
* Function returns the First Line of a commandDescritption as String
* @param {int} commandIndex Index of the command
* @return {String} First line of the commandDescritption
*/
getFirstLineOfCommandDescription(commandIndex){
  return this.localCommandDescriptions[commandIndex].split("\n")[0];
}

/**
* Function that returns all Commands that start with param
* @param {String} commandStart String with shall be searched for fitting commands to
* @return {String:Array} An Array with alle The fitting Command Aliases
}
*/
getCommandsStartingWith(commandStart){
  var fittingCommandArray = [];

  //Check Start of each Alias and add any Matching to Array
  for(var i = 0; i < this.localCommandStartAlias.length; i++){

    if(this.localCommandStartAlias[i].startsWith(commandStart)){
      fittingCommandArray.push(this.localCommandStartAlias[i]);
    }

  }

  //Return array of found Commands
  return fittingCommandArray;
}

/**
*Function that executes the a Command Based on their Alias.
* @param {String} command Command for the Command which function should be executed
* @return {String:Array} Answer Array which each line as seperate, NULL if not successfull
*/
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

}

//-------------------------------------------------
//Create Global Command Definition Object
const localCommands = new CommandDefinition();
//-------------------------------------------------

/**
* Class that is used to process Commands-------------------------------------------------------------------------------------------
*/
class CommandProcessor{
//Current command Answer variable
currentCommandAnswer;
//current Command
currentCommand;
//Current CommandDefinition
commandDefinition;

/**
* Constructor of class
* @param {String} command Command that shall be processed
* @param {CommandDefinition:Object} CommandDefinition that the command should be searched for in
**/
constructor(command, commandDefinition){
  //Save Command to Datafield
 this.currentCommand = command.toLowerCase().trim();
 //Standard init CommandAnswer
 this.currentCommandAnswer = null;
 //Set commandDefinition Reference
 this.commandDefinition = commandDefinition;
}

/**
* Processes Current saved command through searching it in commandDefinition
**/
processCommand(){
  var currentCommandResponse = this.commandDefinition.executeCommandFunction(this.currentCommand);
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
/**
* Get Method for CommandAnswer
* @return Answer to command if processed, null if not available
*/
get commandResponse(){
    return this.currentCommandAnswer;
}

}
