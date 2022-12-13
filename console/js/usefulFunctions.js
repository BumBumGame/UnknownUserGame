/**
* Methods which checks if the parameter p is a promise or not
* @param p Parameter of any type which will be checked for if its a promise
* @return {Boolean} Returns True if p is a Promise, Else: false
**/
function isPromise(p) {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
}

/**
* Methods checks wheter a function is an Async function or not
* @param {function} functionReference A Reference to the function which will be checked
* @return {Boolean} Returns True or False wether function is async or not
**/
function functionIsAsync(functionReference){
  //Check constructor of function
  if (sum.constructor.name === 'AsyncFunction') {
    //Return true if function is async
    return true;
} else {
    return false;
}
}

/**
Returns true if it is a DOM element
* @param {DomElement} o Reference to the Dom Element being checked
* @return {Boolean} true if it is a DOM element 
**/
function isElement(o){
  return (
    typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
    o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
);
}
