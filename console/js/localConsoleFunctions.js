/**
* Functions for CommandExecution (Return null if no out to the console is needed) (Return Array of Strings for Answer: Each element = one line)
* Each Method will automatically get 2 Parameters assgined to it: command(Contains the complete inputted Command as String), executingConsole(contains a reference to the consoleObject of the console eecuting the function)
* Example: functionName(command, executingConsole){}
**/
//-----Communicator Program-------

{
let communicatorCommandDefinition = new CommandDefinition();

//----------
//Report new messages Command
//---------
async function reportNewMessages(command, executingConsole){
  //load communicator Module
  let communicatorModule = await import("./modules/communicatorProgram.js");

  //Get all active ChatNames
  let activeChatNames = communicatorModule.getActiveChatNames();

  //Define Output String Array
  let output = [];

  //Check if a new message is availalbe in any active Chat
  for(let i = 0; i < activeChatNames.length; i++){

  if(await communicatorModule.isNewMessageAvailable(activeChatNames[i])){
    output.push("Neue Nachrichten in Chat '" + activeChatNames[i] + "' !");
  }

  }

  //Return output Array or No new Messages found if empty
  return output.length == 0 ? "Keine neuen Nachrichten verfügbar!" : output;
}

//Add check newMessage Method as a command
communicatorCommandDefinition.addCommand("Check", "Dieser Befehl überprüft, ob neue Nachrichten verfügbar sind.\n"
                                        + "Neue Chats mit Nachrichten werden aufgelistet.", reportNewMessages);
//------------


//Create Communicator Program
var communicatorProgram = new Command("Communicator", "Ein Programm, dass die Kommunikation über das System möglich macht.", true, communicatorCommandDefinition);
}
//--------------------------------
