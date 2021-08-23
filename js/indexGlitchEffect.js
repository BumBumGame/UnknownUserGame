var glitchIntervalArray = [];

function disableGlitchEffect(){
  clearIntervalAnimations();
   //Object Array
   var glitchObjectArray = getGlitchObjects();

   //Disable all Objects
   for(var i = 0; i < glitchObjectArray.length; i++){
     glitchObjectArray[i][0].className += " disableGlitch";
   }
}

function enableGlitchEffect(){
   startIntvervalAnimations();
  //Object Array
  var glitchObjectArray = getGlitchObjects();

  for(var i = 0; i < glitchObjectArray.length; i++){
    if(!glitchObjectArray[i][1]){
    var currentElementClassName = glitchObjectArray[i][0].className;

    glitchObjectArray[i][0].className = currentElementClassName.replace("disableGlitch", "");
  }
 }
}

function clearIntervalAnimations(){

  for(var i = 0; i < glitchIntervalArray.length; i++){
    clearInterval(glitchIntervalArray[i]);
  }

}

function setAnimationInterval(elementID, intervalTime, turnOffTimeout){
  glitchIntervalArray.push(
    setInterval(function() {
       var animationObject = document.getElementById(elementID);

       if(animationObject.className.includes("disableGlitch")){
         animationObject.className = animationObject.className.replace("disableGlitch", "");
       }

         setTimeout(function() {

          if(!animationObject.className.includes("disableGlitch")){
             animationObject.className = (animationObject.className + " disableGlitch").trim();
          }

         }, turnOffTimeout);

    }, intervalTime)
  );
}


function startIntvervalAnimations(){
    setAnimationInterval("cancelText", 1000, 300);
    setAnimationInterval("TitleIcon", 2200, 200);
}

function getGlitchObjects(){
  var glitchObjectArray = [];//[element, hasInterval]

  glitchObjectArray.push([document.getElementById("gameLogin"), false]); //Main Login
  glitchObjectArray.push([document.getElementById("cancelButtonGlitchBox"), false]);//Glitch around cancel Button box
  glitchObjectArray.push([document.getElementById("cancelText"), true]);//cancelButton text glitch
  glitchObjectArray.push([document.getElementById("TitleIcon"), true]);//Hacker icon glitch
  glitchObjectArray.push([document.getElementById("loadingGlitchText"), false])//Loading text glitch

  return glitchObjectArray
}
