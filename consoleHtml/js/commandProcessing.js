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

}

//-------------------------------------------------
//Create Global Command Definition Object
var localCommands = new localCommandDefinition();
//-------------------------------------------------

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
 //Standard init CommandAnswer
 this.currentCommandAnswer = null;
}

processCommand(){
  var currentCommandResponse = localCommands.executeCommandFunction(this.currentCommand);
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