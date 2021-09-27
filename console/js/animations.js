class AnimationQueue{
animationObjectArray; //Array of Animation Objects
animationDelayArray; // Array with delays for when each animation should start playing
currentRunningAnimationIndex; //Current run index
queCurrentlyRunning; //Boolean if Cue is currently running --> False means paused
queTotalRuntime; //Array of total automated runtimes with each index is one after one pause
queUnlimetedRuntimeAnimations; //Array that holds the animationObjectArrayIndex of Elemetns with unlimeted animation time;

constructor(){
  this.animationObjectArray = [];
  this.animationDelayArray = [];
  this.queTotalRuntime = [0];
  this.queUnlimetedRuntimeAnimations = [];
  this.currentRunningAnimationIndex = 0;
  this.queCurrentlyRunning = false;
}

addAnimation(animation, startDelay = 0){
  //Check if parent class of animation is Animation
  if(Object.getPrototypeOf(animation.constructor) !== Animation){
      throw new TypeError("The AnimationObject needs to inherit from class Animation!");
  }
  //Check if object structure is given because its needed by the Que
  animation.checkSubClassStructure();

  //Check if animation time is limited
  if(animation.animationPlayTime > 0){
    //Add animationPLaytime and startDelay to total runtime
    this.queTotalRuntime[this.queTotalRuntime.length - 1] += animation.animationPlayTime;
    this.queTotalRuntime[this.queTotalRuntime.length - 1] += startDelay;
  }else{
    //If animation runs unlimeted set new array index
    this.queTotalRuntime.push(0);
    //Add startDelay
    this.queTotalRuntime[this.queTotalRuntime.length - 1] += startDelay;
    //Save Element in special Array
    this.queUnlimetedRuntimeAnimations.push(this.animationObjectArray.length);
  }
  //Add properties to local Arrays
  this.animationObjectArray.push(animation);
  this.animationDelayArray.push(startDelay);
}

removeAnimmation(animationQueueIndex){
  var unlimetedRuntimeIndex = 0;
  //stop Queue if running
  this.stop();
  //Check if animation is an indefinite Animation
  if(this.animationObjectArray[animationQueueIndex].animationPlayTime == 0){
     //get Index in queUnlimetedRuntime
     unlimetedRuntimeIndex = this.queUnlimetedRuntimeAnimations.indexOf(animationQueueIndex);
     //Decreade every Index after this
     for(var i = unlimetedRuntimeIndex; i < this.queUnlimetedRuntimeAnimations.length; i++){
       this.queUnlimetedRuntimeAnimations[i]--;
     }
     //Add totaltime After Pause to previos
     this.queTotalRuntime[unlimetedRuntimeIndex] += this.queTotalRuntime[unlimetedRuntimeIndex + 1];
     //Delete Total Que time
     this.queTotalRuntime.splice(unlimetedRuntimeIndex + 1, 1);
     //Delete UnLimitedRuntime From Array
     this.queUnlimetedRuntimeAnimations.splice(unlimetedRuntimeIndex, 1);
  }else{
    //Get Animationplaytime
    var animationPlayTime = this.animationObjectArray[animationQueueIndex].animationPlayTime;
    //Get unlimeteRuntimeIndex from witch everything has to shiftet by one
    for(var i = 0; i < this.queUnlimetedRuntimeAnimations.length; i++){
       //Check when index is smaller than in queUnlimetedRuntimeAnimations
       if(this.queUnlimetedRuntimeAnimations[i] > animationQueueIndex){
          //Save index
          unlimetedRuntimeIndex = i;
          break;
       }

     //If it its after the last element
     if(i == this.queUnlimetedRuntimeAnimations.length - 1){
        unlimetedRuntimeIndex = this.queUnlimetedRuntimeAnimations.length;
     }

    }
    //Shift unlimeteRuntimeIndex
    for(var i = unlimetedRuntimeIndex; i < this.queUnlimetedRuntimeAnimations.length; i++){
      this.queUnlimetedRuntimeAnimations[i]--;
    }


  }
  //Substract time from Totaltime
  this.queTotalRuntime[unlimetedRuntimeIndex] -= this.animationObjectArray[animationQueueIndex].animationPlayTime;
  this.queTotalRuntime[unlimetedRuntimeIndex] -= this.animationDelayArray[animationQueueIndex];
  //Remove Element from animationArray
  this.animationObjectArray.splice(animationQueueIndex, 1);
  //Remove Element from delay Array:
  this.animationDelayArray.splice(animationQueueIndex, 1);

}

//Starts first animation in cue
start(){
  //Set status to running
  this.queCurrentlyRunning = true;
  var prevThis = this;
   //Start only when there are Elements in the Cue
   if(this.length > 0){
  //Start first Animation with delay
  setTimeout(function () {
  prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].start();

  if(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime > 0){
    setTimeout(function () { prevThis.next();}, 100);
  }

  }, this.animationDelayArray[this.currentRunningAnimationIndex]);

}
  }

stop(){
 this.queCurrentlyRunning = false;
 this.animationObjectArray[this.currentRunningAnimationIndex].stop();
}

next(){
    var prevThis = this;
  //Check if Current Running Animation is done
  if(this.animationObjectArray[this.currentRunningAnimationIndex].animationRunning == false){
    //Start next animation

      //Wait the delay before Starting
      setTimeout(function () {
        //Count up Animatimation Index
        prevThis.currentRunningAnimationIndex++;
        //Check if Que is done
        if(prevThis.length <= prevThis.currentRunningAnimationIndex){
          //Disable Que
          prevThis.queCurrentlyRunning = false;
          return;
        }
        //Start next Animation
        prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].start();

        //Set next AnimationStart Check
        if(!(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationplaytime > 0) && prevThis.queCurrentlyRunning){
          //Time next execution
          setTimeout(function () { prevThis.next(); }, 100);
        }else{
          //Pause cue
          console.log(prevThis.animationObjectArray[prevThis.currentRunningAnimationIndex].animationPlayTime);
          prevThis.queCurrentlyRunning = false;
        }

        }, prevThis.animationDelayArray[prevThis.currentRunningAnimationIndex + 1]);
  }else{
    setTimeout(function () { prevThis.next(); }, 100);
  }

}

reset(){
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
  //Reset Qeue
  this.reset();
 //Call all delete Functions of Elements in Array
 for(var i = 0; i < this.length; i++){
   this.animationObjectArray[i].deleteDomElement();
 }

}

get length(){
  return this.animationObjectArray.length;
}

}


//-----------------------------------
//Animation Base class which has to be inherited from
class Animation{
animationPlayTime;
animationStepTime;
animationRunning;
//Console Object to be animated to
consoleObject;

  constructor(animationPlayTime, animationStepTime, consoleObject){
     //This class is not allowed to be initialized alone
     if (this.constructor === Animation) {
            throw new TypeError('Abstract class "Animation" cannot be instantiated directly.');
        }
     //Check class Structure
     this.checkSubClassStructure();
     //Set playtime
     this.animationPlayTime = animationPlayTime;
     //Set StepTime
     this.animationStepTime = animationStepTime;
     //Save reference to Console Object
     this.consoleObject = consoleObject;
     //Init Animation as not running
     this.animationRunning = false;
  }

checkSubClassStructure(){
  //Check if all nedded Methods are implemented
  if(this.start === undefined){
         throw new TypeError("Method start() needs to be implemented!");
  }else if(this.stop === undefined){
         throw new TypeError("Method stop() needs to be implemented!");
  }else if(this.reset === undefined){
         throw new TypeError("Method reset() needs to be implemented!");
  }else if(this.animationStep === undefined){
         throw new TypeError("Method animaitonStep() needs to be implemented!");
  }else if(this.deleteDomElement === undefined){
         throw new TypeError("Method deleteDomElement() needs to be implemented!");
  }
}

get animationplatime(){
  return this.animationPlayTime;
}

get animationRunningStatus(){
  return this.animationRunning;
}

}

/*------------------------------------------Define Animation Classes
    - Every Animation Class must have following Methods: start(), animationStep(), stop(), reset(), deleteDomElement()
    - Every Animation Class must extend Animation Base class
*/

//Displays Text loading animation in Console according to parameters
//@param playtime (Integer in ms) Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param maxDotCount (Integer) Number of dots that will be displayed (def:3)
//@param steptime (Integer in ms) Time between each step (=speed)
//@param animationText (String) Text that is displayed by the Animation
//@param consoleObject (Object: InGameConsole) Console animation will be aplied to
class ConsoleTextLoadingAnimation extends Animation{
maxDotCount;
animationObject;
animationText;
currentAnimationDotCount;
animationIDString;
animationMilliseconds;

totalStepCount;
currentStep;

    constructor(playtime, steptime, maxDotCount, animationText, consoleObject){
       super(playtime, steptime, consoleObject);
       //Calculate Total Step count
       this.totalStepCount = Math.floor(playtime/steptime);
       //Set currentStep to 0
       this.currentStep = 0;
       this.maxDotCount = maxDotCount;
       this.animationText = animationText;
       this.currentAnimationDotCount = 0;
       this.animationObject = null;
       //Generate Random Id String
       this.animationIDString = "ConsoleTextLoadAnimation" + ((Math.random().toFixed(4)) * 10000);
         }

animationStep(){
  var millisSinceLastExecution = performance.now() - this.animationMilliseconds;

  //Check if next Step can be Executed
  if(millisSinceLastExecution >= this.animationStepTime){

    //If animaiton has performed all steps: exit
    if(this.currentStep >= this.totalStepCount){
      this.stop();
      return;
    }else{
      this.currentStep++;
    }

  //Check if Dots are above maximum
  if(this.currentAnimationDotCount >= this.maxDotCount){
     this.animationObject.textContent = this.animationText;
     this.currentAnimationDotCount = 0;
  }else{

  this.animationObject.textContent += ".";
  this.currentAnimationDotCount++;
  }

   this.animationMilliseconds = performance.now();

}

  var prevThis = this;

  if(this.animationRunning == true){
    //Set async restart of function
    setTimeout(function () { prevThis.animationStep();}, 0);
  }
}

start(){
  if(this.animationRunning == false){
    //Create New Element if not exists
    if(this.animationObject == null){
     this.consoleObject.printOnConsole(this.animationText, this.animationIDString);
     this.animationObject = document.getElementById(this.animationIDString);
   }
     this.animationRunning = true;

     //Call Step to enable loop with stepDelay
     var prevThis = this;

     //Set current time
     this.animationMilliseconds = performance.now();
     setTimeout(function () { prevThis.animationStep(); }, 0);

  }
}

stop(){
  if(this.animationRunning == true){
    this.animationRunning = false;
  }
}

reset(){
  //Stop Animation
  this.stop();
  //Reset Attributes
  this.animationObject.textContent = this.animationText;
  this.currentAnimationDotCount = 0;
  this.currentStep = 0;
}

deleteDomElement(){
  //Reset Animation
  this.reset();

  this.animationObject.remove();
  this.animationObject = null;
}

}

//Displays Text loading animation in Console according to parameters
//@param playtime (Integer in ms) Time after the animation stops (gets paused) (playtime = 0 --> infinite)
//@param animationText (String) Text to be printed
//@param consoleObject (Object: InGameConsole) Console animation will be aplied to
class ConsoleTextTypingAnimation extends Animation{
animationText;
currentAnimationCharIndex;
animationObject;
animationIDString;

animationMilliseconds;


constructor(playtime, animationText, consoleObject){
      //Calculate Animation step Time
      var animationStepTime = playtime/animationText.length;
     //Call Animation Constructor
     super(playtime, animationStepTime, consoleObject);
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
    this.consoleObject.printOnConsole("", this.animationIDString);
    this.animationObject = document.getElementById(this.animationIDString);
  }

  //Set running Status
  this.animationRunning = true;

  //Save Current Milliseconds
  this.animationMilliseconds = performance.now();
  //Start first step
  this.animationStep();

 }

}

animationStep(){
   //Get millis since last execution
   var millisSinceLastExecution = performance.now() - this.animationMilliseconds;
   //Check if Step can be performed
   if(millisSinceLastExecution >= this.animationStepTime){
      //Execute Step
      //Add Letter to AnimationObject
      this.animationObject.textContent += this.animationText.charAt(this.currentAnimationCharIndex);
      //Count up AnimationCharIndex
      this.currentAnimationCharIndex++;
      //Check if Animation is done or Animation got stopped
      if(this.currentAnimationCharIndex >= this.animationText.length || !this.animationRunning){
        //Stop animation
        this.stop();
        return;
      }
      this.animationMilliseconds = performance.now();
   }

      var prevThis = this;
      //Start next execution check if animation is running
      if(this.animationRunning == true){
      setTimeout(function () { prevThis.animationStep(); }, 0);
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

get currentAnimationObject(){
  return this.animationObject;
}

}


//Displays Text loading animation with Typing animation
//@param playtime (Integer in ms) Time after the animation stops (gets paused) (playtime = 0 --> indefinite)
//@param steptime (Integer in ms) Time between each step (=speed)
//@param animationText (String) Text to be printed
//@param onlyDotsAfterStart (Boolean) Set if onlyDots will be animated after first text print or Text will be printed new everytime as well
//@param typingTextPlayTime Time of the typing Animation on start
//@param consoleObject (Object: InGameConsole) Console animation will be aplied to
class ConsoleTextLoadingAnimationTyping extends Animation{
animationObject;
animationText;
typingAnimationObject;
loadingAnimationObject;
onlyConstantDotAnimation;

animationMilliseconds;

constructor(playtime, steptime, animationText, maxDotCount, onlyDotsAfterStart, typingTextPlayTime, consoleObject){
      //Call Animation Constructor
      super(playtime, steptime, consoleObject);
      //Save animationtext
      this.animationText = animationText;
      //Set maxDotCount
      this.maxDotCount = maxDotCount;
      //Save onlyDotsAfterStart (Boolean)
      this.onlyConstantDotAnimation = onlyDotsAfterStart;
      //Create typingAnimation
      this.typingAnimationObject = new ConsoleTextTypingAnimation(typingTextPlayTime, animationText, consoleObject);
      //Create LoadingAnimaitonObject
      this.loadingAnimationObject = new ConsoleTextLoadingAnimation(playtime, steptime, maxDotCount, animationText, consoleObject);
      //Set animationObject to null
      this.animationObject = null;
}

start(){
      //Check if Animation is not running
      if(this.animationRunning == false){
         //Check if Animation Object Exists and create One if nessecary
         if(this.animationObject == null){
            //Start Typing animmation to create Animation object
            this.typingAnimationObject.start();
            //Get AnimationObject
            this.animationObject = this.typingAnimationObject.currentAnimationObject;
            //Set ConsoleTextLoadingAnimaiton animationObject to the same as the others
            this.loadingAnimationObject.animationObject = this.animationObject;
           //Check if animation is stopped at typing
         }else if(this.animationObject.textContent.length > 0 && this.typingAnimationObject.animationText.length >= this.typingAnimationObject.currentAnimationCharIndex) {
            this.typingAnimationObject.start();
         }

         //Set animation on running;
         this.animationRunning = true;

        //Start next step after Typing animation is finished
        var prevThis = this;
        //Set millis
        this.animationMilliseconds = performance.now();
        setTimeout(function () { prevThis.animationStep(); }, 0);
        //If playtime is set then set timout on stop
        if(this.animationPlayTime > 0){
        setTimeout(function () { prevThis.stop(); }, this.animationPlayTime);
       }
  }
}

stop(){
     //Check if Animation is running
     if(this.animationRunning == true){
        this.animationRunning = false;
        //Stop Typing animation;
        this.typingAnimationObject.stop();
        //Stop Loading animation
        this.loadingAnimationObject.stop();
     }
}

animationStep(){
  //Get current Milliseconds
  var millisSinceLastExecution = performance.now() - this.animationMilliseconds;
  //Check if Step can be performed
     if(millisSinceLastExecution >= this.animationStepTime){


      //Check if Object does still exists
      if(this.animationObject == null){
         //leave function and Stop animation
         this.stop
         return;
      }

     //Start Typing animation if no text is in Element
     if(this.animationObject.textContent.length  == 0){
        //Start Typing function
        this.typingAnimationObject.start();
     }

     //Only Start normal loading animation if typing is done
     if(!this.typingAnimationObject.animationRunning){
        //Check if loading Animation is running
        if(!this.loadingAnimationObject.animationRunning){
           //Start loading animation
           this.loadingAnimationObject.start();
        }else{
           //Check if Animation needs to be reset after Hitting max points
           if(!this.onlyConstantDotAnimation){
               //Check if all dots are displayed
                if(this.loadingAnimationObject.currentAnimationDotCount >= this.loadingAnimationObject.maxDotCount){
                  //Reset Loading Animation
                  this.loadingAnimationObject.reset();
                  //Reset Typing animation
                  this.typingAnimationObject.reset();
                }
           }
        }

     }
   }


      var prevThis = this;

    //If Animation is running rerun this function
    if(this.animationRunning){
        setTimeout(function () { prevThis.animationStep(); }, 0)
    }

}

reset(){
    //Check if Text needs to be reset
    if(this.onlyConstantDotAnimation == false){
      //Reset loading animation
      this.loadingAnimationObject.reset();
      //Reset typing Animation
      this.typingAnimationObject.reset();
    }else{
      //Only reset Dots
      this.loadingAnimationObject.reset();
    }
}

deleteDomElement(){
  //Stop Animation
  this.stop();
  //Reset Animation
  this.reset();
  //Call Delete of Typing animation
  this.typingAnimationObject.deleteDomElement();
  this.loadingAnimationObject.deleteDomElement();
  this.animationObject = null;
}


}

//Prints different lines on the console without individual line animations
//@param playtime (Integer in ms) Time after the animation stops (gets paused)
//@param lines (String Array) Contains all lines to be printed as Strings
//@param consoleObject (Object: InGameConsole) Console animation will be aplied to
class ConsoleLinePrint extends Animation{
textLineArray;
currentLine;
animationObjects;
animationClassString;

animationMilliseconds;

  constructor(playtime, lines, consoleObject){
    //Calculate Steptime
     var steptime = playtime/lines.length;
     //Call aniamtion construtor
     super(playtime, steptime, consoleObject);
     //save array in Attribute
     this.textLineArray = lines;
     //Set standard for currentLine
     this.currentLine = 0;
     //Generate Random ID
     this.animationClassString = "ConsoleLinePrint" + ((Math.random().toFixed(4)) * 10000);
     //init array
     this.animationObjects = [];
  }

  start(){
     //Only Start if animation is not running
     if(!this.animationRunning){
        //Check if Animation is at last step
        if(!(this.currentLine >= this.textLineArray.length)){
           //Start step
           var prevThis = this;
           //Set animation Millis
           this.animationMilliseconds = performance.now();
           //Start animationStep
           setTimeout(function () { prevThis.animationStep(); }, 0);
           //Set Animation to running
           this.animationRunning = true;
        }

     }

  }

  stop(){
   if(this.animationRunning){
     this.animationRunning = false;
   }
  }

  animationStep(){
    //Calculate millis since last execution
    var millisSinceLastExecution = performance.now() - this.animationMilliseconds;
    //Check if Next execution can be made
      if(millisSinceLastExecution >= this.animationStepTime){
        var lineObject = this.consoleObject.printOnConsole(this.textLineArray[this.currentLine], this.animationIDString);
        //Add to Object Array
        this.animationObjects.push(lineObject);
        //Goto next line
        this.currentLine++;
        //set last execution time
        this.animationMilliseconds = performance.now();
        //Check if currentLine is over existing lines
        if(this.currentLine >= this.textLineArray.length){
          this.stop();
          return;
        }
      }

      //Start next step
      if(this.animationRunning){
        var prevThis = this;

       setTimeout(function () { prevThis.animationStep();}, 0);
      }

  }

  reset(){
   //Stop animation
   this.stop();
   //Delete Dom elements
   this.deleteDomElement();
   //Reset currentLine
   this.currentLine = 0;
  }

  deleteDomElement(){
   //Delete all Dom elements
   for(var i =  1; i < this.textLineArray.length; i++){
     this.animationObjects.remove();
   }

   //Set references to null
   this.animationObjects = [];

  }

}

//A progessbar loading animation
//Example: loading [======       ] 37% /
//@param playtime (Integer in ms) Time after the animation stops (gets paused) - Controls animation speed
//@param startPercent (int) Percentage at wich the loading animation starts (0-99)
//@param stopPerecent (int) Percentage at wich the loading animation stops (1-100)
//@param loadingBarWidth (int) Width of loading bar in chars (0 = hidden)
//@param loadingBarFullCharacter (char) character that will be used inside the loading bar for full bars
//@param loadingBarEmptyCharacter (char) character that will be used inside the loading bar for empty bars
//@param showPercentage (boolean) shows and animates percentage value
//@param setloadingSpinToDone (boolean) replaces the loading the loading spin with a done character(false: removes it)
//@param percentageIncrement (int) increment of how big the steps are
//@param animationText (String) text that is shown in front of the Animation
//@param consoleObject (Object: InGameConsole) Console animation will be aplied to
class ProgressBarLoadingAnimation extends Animation{
//animation text
animationText;
//start percentage (saved for reset)
startPercentage;
//endPercentage
endPercentage;
//currentPercentage (inits with startPercentage)
currentPercentage;
//Show percentage boolean
showPercentage;
//Percentage increment
percentageIncrement;
//width of loading bar
loadingBarWidth;
//Character used for loadindBar full bars
loadingBarFullCharacter;
//Character used for loadindBar empty bars
loadingBarEmptyCharacter;
//Number of activated loadingbar chars (max = loadingBarWidth)
currentProgressBarTile;
//IDString for Element
animationIDString;
//Animation Object
animationObject;
//setloadingSpinToDone setting
setloadingSpinToDone

//current spinning loading animation status
spinningAnimationStatus;

//Milliseconds since last execution
animationMilliseconds;

    constructor(playtime, startPercent, stopPercent, loadingBarWidth, loadingBarFullCharacter, loadingBarEmptyCharacter, showPercentage, setloadingSpinToDone, percentageIncrement, animationText, consoleObject){
        //Calculate step time
        let stepCount = (stopPercent - startPercent)/percentageIncrement;
        let steptime = Math.floor(playtime/stepCount);
        //Call animation super constructor
        super(playtime, steptime, consoleObject);

        //save Animationtext
        this.animationText = animationText.trim();
        //Save start Percent
        if(startPercent > 99){
          this.startPercentage = 99;
        }else if(startPercent < 0){
          this.startPercentage = 0;
        }else{
        this.startPercentage = Math.floor(startPercent);
      }

        //Save stop Percent
         if(stopPercent > 100){
           this.endPercentage = 100;
         }else if(stopPercent < 1){
           this.endPercentage = 1;
         }else{
        this.endPercentage = Math.floor(stopPercent);
      }
      //init current Percentage
        this.currentPercentage = this.startPercentage;

        //Save loading bar Width
        this.loadingBarWidth = loadingBarWidth;
        //Save loading Bar Full Character
        this.loadingBarFullCharacter = loadingBarFullCharacter.charAt(0);
        //save loading Bar empty character
        this.loadingBarEmptyCharacter = loadingBarEmptyCharacter.charAt(0);
        //save showPercentage
        this.showPercentage = showPercentage;
        //save setloadingSpinToDone
        this.setloadingSpinToDone = setloadingSpinToDone;
        //Save percentage increment
        this.percentageIncrement = percentageIncrement;
        //Generate random classString
        this.animationIDString = "ProgressBarLoadingAnimation" + ((Math.random().toFixed(4)) * 10000);
        //init animationObject
        this.animationObject = null;
        //init millis
        this.animationMilliseconds = 0;
        //init spinanimation
        this.spinningAnimationStatus = '/';

        //Calculate loadingBar progress at start (If needed)
        if(this.loadingBarWidth > 0){
        this.currentProgressBarTile = Math.floor(loadingBarWidth * (this.startPercentage/100));
      }
    }

    start(){
      if(!this.animationRunning){

        //Create starting Object if none exists
        if(this.animationObject == null){
          //Create and bind Object
          this.consoleObject.printOnConsole("", this.animationIDString);
          this.animationObject = document.getElementById(this.animationIDString);
        }

        //Setting running status to running
        this.animationRunning = true;

        //Setting current millis
        this.animationMilliseconds = performance.now();

        let prevThis = this;

        setTimeout(prevThis.animationStep.bind(this), this.animationStepTime);

        let loadingSpinIntervalTime = 100;
        setTimeout(function() {
          prevThis.spinningAnimationStep(loadingSpinIntervalTime);
        }, loadingSpinIntervalTime);
      }
    }

    animationStep(){
      //Calculate millis since last execution
      var millisSinceLastExecution = performance.now() - this.animationMilliseconds;


        //Check if next step can be performed
        if(millisSinceLastExecution >= this.animationStepTime){
          //Perform next step
          let newGeneratedString = "";

          //Add animation text to string
          newGeneratedString += this.animationText + " # ";

          //Print progress bar if neccessary
          if(this.loadingBarWidth > 0){
            //print starting brackets
            newGeneratedString += "[";
            //Generate loading bar chars that are activated
            for(let i = 0; i < this.currentProgressBarTile; i++){
              newGeneratedString += this.loadingBarFullCharacter;
            }
            //Generate bars that are not active
            for (let i = 0; i < this.loadingBarWidth - this.currentProgressBarTile; i++) {
              newGeneratedString += this.loadingBarEmptyCharacter;
            }
            //print ending brackets
            newGeneratedString += "]";
          }

          //Print space
          newGeneratedString += " ";

          //Display percentage if activated
          if(this.showPercentage){
            newGeneratedString += this.currentPercentage + "%";
          }

          //Print space
          newGeneratedString += " ";

          //Print spinning loading animation char
          newGeneratedString += this.spinningAnimationStatus;

          //Print new string
          this.animationObject.textContent = newGeneratedString;

          //Check if animation is done
          if(this.currentPercentage >= this.endPercentage){
            //Stop animation
            this.stop();
            //set loading Spin to done or remove it (only if 100% complete)
          if(this.endPercentage == 100){
            if(this.setloadingSpinToDone){
              //replace it with done character
                this.animationObject.textContent = this.animationObject.textContent.replace(this.spinningAnimationStatus, '[Erfolgreich]');
            }else{
              //Remove the character
              this.animationObject.textContent = this.animationObject.textContent.replace(this.spinningAnimationStatus, '');
            }
          }

          }

          //claculate next step
          this.currentPercentage += this.percentageIncrement;

          //Check if currentPercentage has hit  or over
        if(this.showPercentage){
          if(this.currentPercentage >= this.endPercentage){
            //Set percentage to end
            this.currentPercentage = this.endPercentage;
          }
        }

          //Calculate bar
          if(this.loadingBarWidth > 0){
            //Calculate next progress bar tile
            this.currentProgressBarTile = Math.floor(this.loadingBarWidth * (this.currentPercentage/100));
          }

          //Save latest millis
          this.animationMilliseconds = performance.now();
        }

        let prevThis = this;

        if(this.animationRunning){
        setTimeout(prevThis.animationStep.bind(this), 5);
        }
    }

    //Optional function for spinning animation
    spinningAnimationStep(interval){

      switch(this.spinningAnimationStatus){
          case '/':
          this.spinningAnimationStatus = '-';
          this.animationObject.textContent = this.animationObject.textContent.replace('/', '-');
          break;

          case '-':
          this.spinningAnimationStatus = '\\';
          this.animationObject.textContent = this.animationObject.textContent.replace('-', '\\');
          break;

          case '\\':
          this.spinningAnimationStatus = '/';
          this.animationObject.textContent = this.animationObject.textContent.replace('\\', '/');
          break;
      }

        var prevThis = this;

      if(this.animationRunning){
         setTimeout(function() {
           prevThis.spinningAnimationStep(interval);
         }, interval);
      }

    }

    stop(){
      if(this.animationRunning){
        this.animationRunning = false;
      }
    }

    reset(){
      //TODO
    }

    deleteDomElement(){
      //TODO
    }

}

//TODO update filename and abstract classname to console animation
