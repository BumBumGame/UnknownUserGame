//Console log object
const consoleLog = document.getElementById("consoleLog");
//Console input Object
const consoleInput = document.getElementById("mainConsoleInput");
//CommandLine Object
const commandLine = document.getElementById("commandLine");

//Attach functionality Object to console-----------------------------------------
const mainConsoleObject = new InGameConsole(consoleLog, consoleInput, commandLine, localCommands);
//-------------------------------------------------------------------------------
