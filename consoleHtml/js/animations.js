class animationQueue{
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

reset(){

}

resetAnimations(){

}

get length(){
  return this.animationObjectArray.length;
}

}


class animation{
animationPlayTime;
animationStepTime;
animationRunning;

  constructor(animationPlayTime, animationStepTime){
     this.animationPlayTime = animationPlayTime;
     this.animationStepTime = animationStepTime;
     this.animationRunning = false;
  }

}

//Displays Text loading animation in Console according to parameters
//@param playtime Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param maxDotCount Anzahl der max anzuhängenden Punkte (def:3)
//@param steptime Zeit zwischen jedem Schritt (=Geschwindigkeit)
class textLoadingAnimation extends animation{
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
       this.animationIDString = "textLoadAnimation" + ((Math.random().toFixed(3)) * 1000);
         }

animationStep(){
  //Check if Dots are above maximum
  if(this.currentAnimationDotCount >= this.maxDotCount){
    this.animationObject.textContent = this.animationText;
    this.currentAnimationDotCount = 0;
  }

  this.animationObject.textContent += ".";
  this.currentAnimationDotCount++;

  if(this.animationRunning == true){
     setTimeout(this.animationStep.bind(this), this.animationStepTime);
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

     //Call Steo to enable loop
     this.animationStep();

     //Setup Stop Timer if animation is timed
    var prevThis = this;

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

}

//Testing
var testAnimation = new textLoadingAnimation(5000, 350, 4, "loading");
var testAnimation2 = new textLoadingAnimation(5000, 350, 4, "loading2");
var que = new animationQueue();

que.addAnimation(testAnimation);
que.addAnimation(testAnimation2);
