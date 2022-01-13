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
var currentParserBranchPosition = []; //Array that hold the indexes of each next branch
var currentParserMessagePosition = 0; //Index of the current Message inside the branch

/**
* This Function request the latest Message in a specific Chat or the offlineXml Chat
* @async
* @param {String} chatName The Name of the chat (a.e filename) - If an offlineXml is loaded this Parameter does not have any effect
* @return {String} Next newest unread message or the last read one if no new ones are available
**/
export async function getLatestMessage(chatName){

  //Check if offline xml is loaded
  if(isInOfflineMode()){
    //load latest Message from offline XML

  }else{
    //request latest message from Server for chatName
  }

}

/**
* Returns Message Content at specific position
**/
function getOfflineXMLMessageContent(branchIndex, messageIndex){

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
