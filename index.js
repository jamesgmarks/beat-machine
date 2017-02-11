

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
  const $controlsContainer = t.content.querySelector(".controls");
  const $switchBox = t.content.querySelector(".switchbox");
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

  var samples = [
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
    mixer.appendChild(renderSwitchBox(samples, 5, 4));

  window.addEventListener('click', function(e) {
    const cList = e.target.classList;
    if(cList.contains("switch")) {
      console.log("clicked a switch");
      cList.toggle("play");
    } else if(cList.contains("sample-name")) {
      playAudio(e.target.parentNode.querySelector("audio"));
    }
  })

}