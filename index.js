

let currentIndex = -1;
let playing = false;
let beatMeasure = 8;
let beatsPerLoop = 4;

let bpm = 140;
let beatLoop = null;

// Play an audio
function playAudio(audioElement) {
  if(!audioElement || !audioElement.tagName || !audioElement.tagName === "audio") 
    return; // If we didn't get an audio element, then  fuggedaboutit!
  audioElement.currentTime = 0; // Restart in case its already going...
  audioElement.play(); // Play the sound
}


// DEBUG: Testing 1,2,3
// aka. audio 'hello world!'
const t = document.getElementById('mixer-template');
if(! ('content' in t)) {
  alert("This aint gonna work man!");
} else {

  // Get elements out of mixer template
  const $indicatorRow = t.content.querySelector(".indicator-row");
  const $indicatorSwitchHeader = t.content.querySelector(".indicator-header");
  const $indicatorSwitchContainer = t.content.querySelector(".indicator-switch-container");
  const $indicatorSwitch = t.content.querySelector(".indicator-switch");

  const $controlsContainer = t.content.querySelector(".controls-container");
  const $switchBox = t.content.querySelector(".switch-box");
  const $sampleRow = t.content.querySelector(".sample-row"); 
  const $sampleSwitches = t.content.querySelector(".sample-switches"); 
  const $sampleContainer = t.content.querySelector(".sample-container");
  const $audioPlayer = t.content.querySelector(".audio-player");
  const $switches = t.content.querySelector(".switches");
  const $switchGroup = t.content.querySelector(".switch-group");
  const $switch = t.content.querySelector(".switch");


  // const audiothing = document.importNode(audioPlayer, true);
  // document.getElementById("mixer").appendChild(audiothing);

  // Create rows based on samples in db, etc.
  // Inject control-box into #mixer


  /***********************************\
  | Functions for drawing switchboard |
  \***********************************/
  // Render a switch <div class="switch" data-on></div>
  const renderSwitch = function() {
    const _switch = document.importNode($switch, true);
    return _switch;
  }

  // Render a switch group 
  const renderSwitchGroup = function(switchCount = 4) {
    const _switchGroup = document.importNode($switchGroup, false);
    for(let i = 0; i < switchCount; i++) {
      _switchGroup.appendChild(renderSwitch());
    }
    return _switchGroup;
  }

  // Render switches container
  const renderSwitchContainer = function(groupCount = 5, switchCount = 4) {
    const _switchContainer = document.importNode($sampleSwitches, false);
    for(let i = 0; i < groupCount; i++) {
      _switchContainer.appendChild(renderSwitchGroup(switchCount));
    }
    return _switchContainer;
  }

  // Render sample row header column
  const renderSampleHeaderColumn = function(name, source) {
    const _sampleHeader = document.importNode($sampleContainer, true);
    _sampleHeader.querySelector(".sample-name").innerText = name;
    _sampleHeader.querySelector(".audio-player").src = source;
    return _sampleHeader;
  }

  // Render entire sample row
  const renderSampleRow = function(name, source, groupCount, switchCount) {
    const _sampleRow = document.importNode($sampleRow, false);
    _sampleRow.appendChild(renderSampleHeaderColumn(name, source));
    _sampleRow.appendChild(renderSwitchContainer(groupCount, switchCount));
    return _sampleRow;
  }

  // Render switchbox
  const renderSwitchBox = function(samplesList = [], groupCount = 5, switchCount = 4) {
    const _switchBox = document.importNode($switchBox, false);
    for(let i = 0; i < samplesList.length; i++) {
      let { name, source } = samplesList[i];
      _switchBox.appendChild(renderSampleRow(name, source, groupCount, switchCount));
    }
    return _switchBox;
  }

  // Render control box
  const renderControls = function() {
    const _controls = document.importNode($controlsContainer, true);
    return _controls;
  }

  const renderIndicatorSwitch = function() {
    const _indicatorSwitch = document.importNode($indicatorSwitch, false);
    return _indicatorSwitch;
  }
  const renderIndicatorContainer = function(switchCount = 20) { // 5 groups of 4
    const _indicatorSwitchContainer = document.importNode($indicatorSwitchContainer, false);
    for(let i = 0; i < switchCount; i++) {
      _indicatorSwitchContainer.appendChild(renderIndicatorSwitch());
    }
    return _indicatorSwitchContainer;
  }
  const renderIndicatorHeader = function() {
    const _indicatorSwitchHeader = document.importNode($indicatorSwitchHeader, false);
    return _indicatorSwitchHeader;
  }
  const renderIndicatorRow = function(switchCount = 20) { // 5 groups of 4
    const _indicatorRow = document.importNode($indicatorRow, false);
    _indicatorRow.appendChild(renderIndicatorHeader());
    _indicatorRow.appendChild(renderIndicatorContainer(switchCount));
    return _indicatorRow;
  }


  const samples = [
    { name: 'Acoustic Snare', source: './sounds/Acoustic Snare-01.wav'},
    { name: 'Electric Clap 2', source: './sounds/CYCdh_ElecK05-Clap02.wav'},
    { name: 'Electric Kick 2', source: './sounds/CYCdh_ElecK05-Kick02.wav'},
    { name: 'Loose Kick 4', source: './sounds/CYCdh_LooseKick-04.wav'},
    { name: 'Loose Kick 8', source: './sounds/CYCdh_LooseKick-08.wav'},
    { name: 'MultiCrash High 1', source: './sounds/CYCdh_MultiCrashHi-01.wav'},
    { name: 'Sonic Flame 01', source: './sounds/CYCdh_SonFlam-01.wav'},
    { name: 'Sonic Sonar Off 06', source: './sounds/CYCdh_SonSnrOff-06.wav'},
  ];
  const mixer = document.getElementById("mixer");
    mixer.appendChild(renderControls());
    mixer.appendChild(renderIndicatorRow(beatsPerLoop * beatMeasure));
    mixer.appendChild(renderSwitchBox(samples, beatsPerLoop, beatMeasure));


  //Event handling
  window.addEventListener('click', function(e) {
    const cList = e.target.classList;
    if(cList.contains("switch")) {
      cList.toggle("play");
    } else if(cList.contains("sample-on")) {
      cList.toggle("off");
    } else if(cList.contains("sample-name")) {
      playAudio(e.target.parentNode.querySelector("audio"));
    } else if(cList.contains("fa-play") || cList.contains("fa-pause")) {
      cList.toggle("fa-pause");
      cList.toggle("fa-play");
      playing = !playing;
    } else if(cList.contains("fa-trash")) {
      // get all .switch on page and remove class "on"
      document.querySelectorAll(".switch").forEach((_switch) => _switch.classList.remove("play"));
    }
  });

  window.addEventListener('load', function() {
    // Beat "animation"
    //resetBeatLoop(getBeatTime());
    // TODO: use getAnimationFrame();
    
    window.requestAnimationFrame(step);
  });

  function changeSettingTextbox(e) {
    switch(e.target.id) {
      case "bpm":
        bpm = parseInt(e.target.value, 10);
        //console.log("new bpm is " + bpm);
        break;
      case "measure":
        beatMeasure = parseInt(e.target.value, 10);
        if(beatMeasure < 1) {
          beatMeasure = 1;
          e.target.value = 1;
        }
        //console.log("new measure is " + beatMeasure);
        break;
      case "seconds":
        beatsPerLoop = parseInt(e.target.value, 10);
        //console.log("new loopcount is " + beatsPerLoop);
        break;
      default:
        console.error("Unknown setting textbox.");
    }
  }

  document.querySelectorAll("#bpm, #measure, #seconds").forEach((element) => element.addEventListener('change', changeSettingTextbox));

  let next = null;
  function step(timestamp) { // timestamp in millis!!!
    //console.log("step");
    if (!next) { 
      //console.log("setting timestamp");
      next = timestamp + (getBeatTime(beatMeasure));
      //console.log("Next: " + next, "Beat time: " + getBeatTime());
    }
    if(next < timestamp) {
      //console.log("Doing next");
      if(playing) {
        doNextBeat();
      }
      next = timestamp + getBeatTime(beatMeasure);
    }
    window.requestAnimationFrame(step);
  }

  function resetBeatLoop(speed) {
    if(beatLoop !== null) {
      clearInterval(beatLoop);
    }
    beatLoop = setInterval(() => {
      if(playing) {
        var nextBeatIndex = doNextBeat();
      }
    }, speed);
  }

  function getBeatTime(beatMeasure = 8) {
    return (bpm / 60) * (1000 / beatMeasure);
  }

  function getTotalBeats() {
    return beatsPerLoop * beatMeasure;
  }

  function doNextBeat() {

    // increment or rotate the beat indexer
    currentIndex += 1;
    if(currentIndex === getTotalBeats()) {
      currentIndex = 0;
    }

    renderBeat(currentIndex);
    playBeatsIfSelected(currentIndex);
    
    // not sure if this is even necessary anymore.
    return currentIndex;

  }

  function renderBeat(index) {
    // get all indicators
    const indicators = document.getElementsByClassName("indicator-switch");
    // clear the last indicator
    let currentIndicator = document.querySelector(".indicator-switch.on");
    if(currentIndicator) {
        currentIndicator.classList.remove("on");
    }
    // show "light" on current indicator
    indicators[index].classList.add("on");

  }
  
  function playBeatsIfSelected(index) { // plural, loops through all sample rows
    const sampleRows = Array.from(document.querySelectorAll(".sample-row"));
    sampleRows.forEach((row) => {
      if(!row.querySelector(".sample-on").classList.contains("off")) {
        playBeatIfSelected(row, index);
      }
    });
  }

  function playBeatIfSelected(sampleRow, index) { // singular, handles one sample row.
    const samplePlayer = sampleRow.querySelector("audio");
    const switches = Array.from(sampleRow.querySelectorAll(".switch"));
    if(switches[index].classList.contains("play")) {
      playAudio(samplePlayer);
    };
  }


}