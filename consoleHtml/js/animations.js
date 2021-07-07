class AnimationQueue{
animationObjectArray;
animationDelayArray;
currentRunningAnimationIndex;
queCurrentlyRunning;

constructor(){
  this.animationObjectArray = [];
  this.animationDelayArray = [];
  this.currentRunningAnimationIndex = 0;
  this.queCurrentlyRunning = false;
}

addAnimation(animation, startDelay){
  this.animationObjectArray.push(animation);
  this.animationDelayArray.push(startDelay);
}

//Starts first animation in cue
start(){
  //Start first Animation
  this.animationObjectArray[this.currentRunningAnimationIndex].start();
  this.queCurrentlyRunning = true;

  var prevThis = this;

  if(this.animationObjectArray[this.currentRunningAnimationIndex].animationPlayTime > 0){
    setTimeout(function () { prevThis.next();}, this.animationObjectArray[this.currentRunningAnimationIndex].animationPlayTime);
  }

  }

stop(){
 this.queCurrentlyRunning = false;
 this.animationObjectArray[this.currentRunningAnimationIndex].stop();
}

next(){
  //Stop running animation
  this.animationObjectArray[this.currentRunningAnimationIndex].stop();
  //if delay is not 0 then wait
  var prevThis = this;

  setTimeout(function () {
     //Add +1 to currentAnimationindex
     prevThis.currentRunningAnimationIndex++;
     if(prevThis.length <= prevThis.currentRunningAnimationIndex){
       this.queCurrentlyRunning = false;
       return;
     }

     //Start next Animation
     prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].start();

     //Set next animation Start if animationPlaytime is limited
     if(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime > 0 && prevThis.queCurrentlyRunning){
       setTimeout(function () { prevThis.next();}, prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime);
     }

  }, this.animationDelayArray[this.currentRunningAnimationIndex]);

}

resetAnimations(){
  //Stop current Run
  this.stop();

  //Call Reseters of every single Animation Object
  for(var i = 0; i < this.length; i++){
     this.animationObjectArray[i].reset();
  }

  //Reset queAnimationIndex
  this.currentRunningAnimationIndex = 0;

}

deleteAnimationsDomElements(){
 //Call all delete Functions of Elements in Array
 for(var i = 0; i < this.length; i++){
   this.animationObjectArray[i].deleteDomElement();
 }

}

get length(){
  return this.animationObjectArray.length;
}

}


class Animation{
animationPlayTime;
animationStepTime;
animationRunning;

  constructor(animationPlayTime, animationStepTime){
     //Set playtime
     this.animationPlayTime = animationPlayTime;
     //Set StepTime
     this.animationStepTime = animationStepTime;
     //Init Animation as not running
     this.animationRunning = false;
  }

}

/*------------------------------------------Define Animation Classes
    - Every Animation Class must have following Methods: start(), animationStep(), stop(), reset(), deleteDomElement()
    - Every Animation Class must extend Animation Base class
*/

//Displays Text loading animation in Console according to parameters
//@param playtime Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param maxDotCount Anzahl der max anzuhängenden Punkte (def:3)
//@param steptime Zeit zwischen jedem Schritt (=Geschwindigkeit)
class ConsoleTextLoadingAnimation extends Animation{
maxDotCount;
animationObject;
animationText;
currentAnimationDotCount;
animationIDString;

    constructor(playtime, steptime, maxDotCount, animationText){
       super(playtime, steptime);
       this.maxDotCount = maxDotCount;
       this.animationText = animationText;
       this.currentAnimationDotCount = 0;
       this.animationObject = null;
       //Generate Random Id String
       this.animationIDString = "ConsoleTextLoadAnimation" + ((Math.random().toFixed(4)) * 10000);
         }

animationStep(){
  //Check if Dots are above maximum
  if(this.currentAnimationDotCount >= this.maxDotCount){
    this.reset();
  }

  this.animationObject.textContent += ".";
  this.currentAnimationDotCount++;

  var prevThis = this;

  if(this.animationRunning == true){
    setTimeout(function () { prevThis.animationStep();}, this.animationStepTime);
  }
}

start(){
  if(this.animationRunning == false){
    //Create New Element if not exists
    if(this.animationObject == null){
     printOnConsole(this.animationText, this.animationIDString);
     this.animationObject = document.getElementById(this.animationIDString);
   }
     this.animationRunning = true;

     //Call Step to enable loop with stepDelay
     var prevThis = this;
     setTimeout(function () { this.animationStep(); }, this.animationStepTime);
     this.animationStep();

     //Setup Stop Timer if animation is timed
     if(this.animationPlayTime > 0){
       setTimeout(function () { prevThis.stop();}, this.animationPlayTime);
     }

  }
}

stop(){
  if(this.animationRunning == true){
    this.animationRunning = false;
  }
}

reset(){
  this.animationObject.textContent = this.animationText;
  this.currentAnimationDotCount = 0;
}

deleteDomElement(){
  //Reset Animation
  this.reset();

  this.animationObject.remove();
  this.animationObject = null;
}

}

class ConsoleTextTypingAnimation extends Animation{
animationText;
currentAnimationCharIndex;
animationObject;
animationIDString;

constructor(playtime, animationText){
      //Calculate Animation step Time
      var animationStepTime = playtime/animationText.length;
     //Call Animation Constructor
     super(playtime, animationStepTime);
     //Animations text stellen
     this.animationText = animationText;
     //Set startIndex to 0
     this.currentAnimationCharIndex = 0;
     //Generate id String
     this.animationIDString = "ConsoleTextTypingAnimation" + ((Math.random().toFixed(4)) * 10000);
}

start(){
  //If Animation is not running
 if(this.animationRunning == false){

  //Create Animation Object if it doesnt exist yet
   if(this.animationObject == null){
    printOnConsole("", this.animationIDString);
    this.animationObject = document.getElementById(this.animationIDString);
  }

  //Set running Status
  this.animationRunning = true;

  //Start first step
  this.animationStep();

 }

}

animationStep(playtime, animationObject){
    //Add Letter to AnimationObject
    this.animationObject.textContent += this.animationText.charAt(this.currentAnimationCharIndex);
    //Count up AnimationCharIndex
    this.currentAnimationCharIndex++;
    //Check if Animation is done or Animation got stopped
    if(this.currentAnimationCharIndex > this.animationText.length || !this.animationRunning){
      //Stop animation
      this.stop();
    }else{
      var prevThis = this;
      //Set Timout for next Execution
      setTimeout(function () { prevThis.animationStep(); }, this.animationStepTime);
    }

}

stop(){
  //If Animation is running
  if(this.animationRunning == true){
    this.animationRunning = false;
  }

}

reset(){
  this.animationObject.textContent = "";
  this.currentAnimationCharIndex = 0;
  this.animationRunning = false;
}

deleteDomElement(){
  //Reset Animation
  this.reset();
  
  this.animationObject.remove();
  this.animationObject = null;
}

}

//Testing
var testAnimation = new ConsoleTextLoadingAnimation(5000, 350, 4, "loading");
var testAnimation2 = new ConsoleTextLoadingAnimation(5000, 350, 4, "loading2");
var testAnimation3 = new ConsoleTextTypingAnimation(200, "loading3");
var que = new AnimationQueue();

que.addAnimation(testAnimation);
que.addAnimation(testAnimation2);
