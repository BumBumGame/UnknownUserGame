/**
* Communicator module (uses server Connection as default, can be set to use a local xml file)
* @module Communicator
**/

//Load asnyLoaderModule
import * as asyncLoader from "./asyncLoader.js";

//Global Module variable for xmlFile (null if on online mode)
var xmlFile = null;

//Global Variable for saving OfflineXML Conditions
var offlineXMLConditions = [];

//Global Variables which hold the current xmlParser Position
var currentParserBranchPosition = []; //Holds the indexes of which branches were taken as an Array (each level is a new index)
var currentParserMessagePosition = 0; //Index of the current Message inside the branch

/**
* This Function request the latest Message in a specific Chat or the offlineXml Chat
* @async
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {String} Next newest unread message or the last read one if no new ones are available
**/
export function getLatestMessage(chatName){

  //Check if offline xml is loaded
  if(isInOfflineMode()){
    //Choose First Branch if none has been chosen


    //load latest Message from offline XML

  }else{
    //request latest message from Server for chatName
  }

}

/**
* Downloads the xml on the path and sets the module into offline mode with downloaded xml
* @async
* @param {String} pathToXML Path to the xml File to be used
* @return {Boolean} true if load was successfull | false if it failed
**/
export async function setOfflineXML(pathToXML){
  //reserver Variable
  let loadedXmlFile;

  //Try to load xml File
  try{
   loadedXmlFile = await asyncLoader.loadFileFromServerAsXml(pathToXML);
}catch(error){
  //If file cannot be loaded then print error and leave function
  console.log(error.message);
  //return false
  return false;
}
  //If File was loaded successfully:

  //Reset values of last xml
  offlineXMLConditions = [];
  currentParserBranchPosition = [];
  currentParserMessagePosition = 0;

  //Save xml in variable
  xmlFile = loadedXmlFile;

  //return true
  return true;
}

/**
* Function that returns the offlineXml File or null if Communicator is in online Mode
* @return {XMLDocument|null} Current active offlineXml or null if in online Mode
**/
export function getOfflineXML(){
  return xmlFile;
}

/**
* Sets communicator back into online Mode. Clears all offlineXML Data!
**/
export function setToOnlineMode(){
  xmlFile = null;
  offlineXMLConditions = [];
  currentParserBranchPosition = [];
  currentParserMessagePosition = 0;
}

/**
* Checks if Communicator is in offline Mode or not
* @return {boolean} Communicator is in OfflineMode or not
**/
export function isInOfflineMode(){
   return xmlFile == null ? false : true;
}

//---------------------------------------------------
//Parser
//---------------------------------------------------

//---Offline-----
/**
* Returns Neweset Message of the offline XML
* @return {String|null} Returns the newest Message as String or null if in online Mode
**/
function getLatestOfflineXMLMessageContent(){
//if in online Mode return null
if(!isInOfflineMode()){
  return null;
}

//Parse to latest Message

}


/**
* Returns all new branch options of the current offline branch as a NodeList (or null if none exist)
* @return {NodeList|null} Returns branchoptions as Nodelist or null if in onlineMode or no branch options were found.
**/
function getCurrentOfflineBranchOptions(){
//if in online Mode return null
if(!isInOfflineMode()){
  return null;
}

//all branch ELements in the Scope of the current branch
  //let newBranchList = xmlFile.getElementsByTagName("branch")[currentParserBranchPosition].querySelectorAll(':scope > branch');
  return xmlFile.getElementsByTagName("branch")[0].querySelectorAll(':scope > branch');
}

/**
* Returns the branch the parser is currently in or null if no branch has been chosen at the beginning of the chat
* @return {DOM-Element|null} Null if there is no active branch, onlineModeActive,branch is not found or the xmlElement of the branch
**/
function getCurrentOfflineBranch(){
  if(currentParserBranchPosition.length == 0 || !isInOfflineMode()) {
    return null;
  }

  //Find and return branch
  //init currentBranchContext with xmlFile
  let currentBranchContext = xmlFile.querySelectorAll(':scope > branch')[currentParserBranchPosition[0]];
  for(let i = 1; i < currentParserBranchPosition.length; i++){
    currentBranchContext = currentBranchContext.querySelectorAll(':scope > branch')[currentParserBranchPosition[i]];
    //If branch cannot be found return null
    if(currentBranchContext == null){return null;}
   }

  //return branch
  return currentBranchContext;
}

//-----Online-----
