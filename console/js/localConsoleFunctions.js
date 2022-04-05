/**
* Functions for CommandExecution (Return null if no out to the console is needed) (Return Array of Strings for Answer: Each element = one line)
* Each Method will automatically get 2 Parameters assgined to it: command(Contains the complete inputted Command as String), executingConsole(contains a reference to the consoleObject of the console eecuting the function)
* Example: functionName(command, executingConsole){}
**/
//-----Communicator Program-------

{
let communicatorCommandDefinition = new CommandDefinition();

async function checkForNewMessages(command, executingConsole){
  //load communicator Module
  let communicatorModule = await import("./modules/communicatorProgram.js");

  //Check if a new message is even available
  if(! await communicatorModule.isNewMessageAvailable("introChat")){
    return "Keine neuen Nachrichten verfügbar!";
  }

  //Else: get latest Message
  return communicatorModule.getLatestMessage();
}

//Add check newMessage Method as a command
communicatorCommandDefinition.addCommand("Check", "Dieser Befehl überprüft, ob neue Nachrichten verfügbar sind.", checkForNewMessages);

//Create Communicator Program
var communicatorProgram = new Command("Communicator", "Ein Programm, dass die Kommunikation über das System möglich macht.", true, communicatorCommandDefinition);
}
//--------------------------------
