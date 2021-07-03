//Array that holds all local Commands
var localCommandNames = ["clear", "help"];

//Current command Answer variable
var currentCommandAnswer = "";

//Function that starts to process the command
function processCommand(command){
    var lowerCaseCommand = command.toLowerCase().trim();

    processLocalCommand(lowerCaseCommand);
}

//Execute localCommand
//@return false if not a local command
function processLocalCommand(command){
     var commandStart = command.split(" ")[0];

     var commandIndex = localCommandNames.indexOf(commandStart);

     if(commandIndex != -1){

       switch(commandIndex){

         case 0: //clear Command index
         executeClearCommand();
         break;
       }

     }

}

//Identifies local Calls the corresponding function
function executeLocalCommand(){

}


//local Command functions
//Clear Command
function executeClearCommand(){
   clearCommandLog();
}
