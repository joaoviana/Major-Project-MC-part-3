let audioCaveReady = false;
let caveScene;
let caveAudioContext;
let mermaidCaveSound;
let mermaidCaveSoundSource;
let mermaidSource;

let stormSound;
let stormSoundSource;
let stormSource;

let infoLateSound;
let infoLateSoundSource;
let infoSource;

function initCaveAudioContext() {
  // Set room acoustics properties.
  let caveAudioDimensions = {
    width: 50,
    height: 20,
    depth: 50
  };


  let caveMaterial = setAllRoomProperties("transparent");
 

  caveAudioContext = new(window.AudioContext || window.webkitAudioContext)();

  // Create a (1st-order Ambisonic) ResonanceAudio scene.
  caveScene = new ResonanceAudio(caveAudioContext);

  // Send scene's rendered binaural output to stereo out.
  caveScene.output.connect(caveAudioContext.destination);

  caveScene.setRoomProperties(caveAudioDimensions, caveMaterial);

  //mermaid sound source
  // Create an audio element. Feed into audio graph.
  mermaidCaveSound = document.createElement("audio");
  mermaidCaveSound.src = "./soundFiles/mermaidsound.wav";
  mermaidCaveSound.crossOrigin = "anonymous";
  mermaidCaveSound.load();
  mermaidCaveSoundSource = caveAudioContext.createMediaElementSource(mermaidCaveSound);
  //mermaid sound source late reflections: [3.4713995456695557, 3.628162384033203, 3.4498541355133057, 10.031046867370605, 16.801977157592773, 16.65700912475586, 9.47618293762207, 5.426042079925537, 1.875927209854126]

  mermaidSource = caveScene.createSource();
  mermaidSource.setGain(1.3);
  mermaidCaveSoundSource.connect(mermaidSource.input);

  // storm sea sound
  // Create an audio element. Feed into audio graph.
  stormSound = document.createElement("audio");
  stormSound.src = "./soundFiles/stormysea.wav";
  stormSound.crossOrigin = "anonymous";
  stormSound.load();
  stormSoundSource = caveAudioContext.createMediaElementSource(stormSound);

  // Create a Source, connect desired audio input to it.
  stormSource = caveScene.createSource();
  stormSource.setGain(0.2);
  stormSoundSource.connect(stormSource.input);

  //information late reflections soundfile
  infoLateSound = document.createElement("audio");
  infoLateSound.src = "./soundFiles/late-reflections-menu.m4a";
  infoLateSound.crossOrigin = "anonymous";
  infoLateSound.load();
  infoLateSoundSource = caveAudioContext.createMediaElementSource(infoLateSound);

  // Create a Source, connect desired audio input to it.
  infoSource = caveScene.createSource();
  infoSource.setGain(1.5);
  infoLateSoundSource.connect(infoSource.input);

  setTimeout(() => {
    //play the infosound
    infoLateSound.play();
  }, 3000);

  setTimeout(() => {
    //make the audio cave ready set to true
    console.log('audio is ready');
    audioCaveReady = true;
    console.log('boolean', audioCaveReady);
    console.log('playing');
    caveMaterial = setAllRoomProperties("sheet-rock");
    caveScene.setRoomProperties(caveAudioDimensions, caveMaterial);
    stormSound.setAttribute('loop', true);
    stormSound.play();
    mermaidCaveSound.setAttribute('loop', true);
    mermaidCaveSound.play();
  }, 64000);
}

AFRAME.registerComponent("storm-sound-source", {
  init: function () {
    this.wpVector = new THREE.Vector3();
    
  },

  tick: function () {
    var cameraEl = this.el.sceneEl.camera.el;
    if (stormSource) {
      stormSource.setFromMatrix(new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
        cameraEl.object3D.matrixWorld)));
    }
  }
});

AFRAME.registerComponent("mermaid-cave-sound-source", {
  init: function () {
    this.wpVector = new THREE.Vector3();
   
  },

  tick: function () {
    var cameraEl = this.el.sceneEl.camera.el;
    if (mermaidSource) {
      mermaidSource.setFromMatrix(new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
        cameraEl.object3D.matrixWorld)));
    }
  }
});

AFRAME.registerComponent("late-reflection-1", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 3.4713995456695557) * 0.1 ;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});

AFRAME.registerComponent("late-reflection-2", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr2");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 3.628162384033203) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});

AFRAME.registerComponent("late-reflection-3", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr3");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 3.4498541355133057) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});

AFRAME.registerComponent("late-reflection-4", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr4");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 10.031046867370605) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});

AFRAME.registerComponent("late-reflection-5", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr5");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 16.801977157592773) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});


AFRAME.registerComponent("late-reflection-6", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr6");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 16.65700912475586) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});

AFRAME.registerComponent("late-reflection-7", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr7");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 9.47618293762207) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});

AFRAME.registerComponent("late-reflection-8", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr8");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += ( 50 / 5.426042079925537) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});

AFRAME.registerComponent("late-reflection-9", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr9");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += (50 / 1.875927209854126) * 0.1;
    if(this.torus.getAttribute('radius') > 50) {
      this.torus.setAttribute('radius', 0.1);
      this.i = 0;
    }
  }
});


//approximately: 50/latereflections durations 
//get individual velocity values and display them
// if radius is bigger than 50, start all over again 
//mermaid sound source late reflections: [3.4713995456695557, 3.628162384033203, 3.4498541355133057, 10.031046867370605, 16.801977157592773, 16.65700912475586, 9.47618293762207, 5.426042079925537, 1.875927209854126]