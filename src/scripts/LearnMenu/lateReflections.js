let caveAudioContext;
let caveScene;
let caveSource;
let audioCaveReady = false;
let mermaidCaveSound;
let mermaidCaveSoundSource;

let stormSound;
let stormSoundSource;
let lateSource1;

function initCaveAudioContext() {
  // Set room acoustics properties.
  let caveAudioDimensions = {
    width: 50,
    height: 20,
    depth: 50
  };


  let caveMaterial = setAllRoomProperties("sheet-rock");

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

  caveSource = caveScene.createSource();
  caveSource.setGain(1.3);
  mermaidCaveSoundSource.connect(caveSource.input);

  // storm sea sound
  // Create an audio element. Feed into audio graph.
  stormSound = document.createElement("audio");
  stormSound.src = "./soundFiles/stormysea.wav";
  stormSound.crossOrigin = "anonymous";
  stormSound.load();
  stormSoundSource = caveAudioContext.createMediaElementSource(stormSound);

  // Create a Source, connect desired audio input to it.
  lateSource1 = caveScene.createSource();
  lateSource1.setGain(0.2);
  stormSoundSource.connect(lateSource1.input);

  audioCaveReady = true;
}

AFRAME.registerComponent("storm-sound-source", {
  init: function () {
    this.wpVector = new THREE.Vector3();
    stormSound.setAttribute('loop', true);
    stormSound.play();
  },

  tick: function () {
    var cameraEl = this.el.sceneEl.camera.el;
    if (lateSource1) {
      lateSource1.setFromMatrix(new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(
        new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
        cameraEl.object3D.matrixWorld)));
    }
  }
});

AFRAME.registerComponent("mermaid-cave-sound-source", {
  init: function () {
    this.wpVector = new THREE.Vector3();
    mermaidCaveSound.setAttribute('loop', true);
    mermaidCaveSound.play();
  },

  tick: function () {
    var cameraEl = this.el.sceneEl.camera.el;
    if (caveSource) {
      caveSource.setFromMatrix(new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(
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
    this.i += 25 / 3.4713995456695557;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});

AFRAME.registerComponent("late-reflection-2", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 3.628162384033203;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});

AFRAME.registerComponent("late-reflection-3", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 3.4498541355133057;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});

AFRAME.registerComponent("late-reflection-4", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 10.031046867370605;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});

AFRAME.registerComponent("late-reflection-5", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 16.801977157592773;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});


AFRAME.registerComponent("late-reflection-6", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 16.65700912475586;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});

AFRAME.registerComponent("late-reflection-7", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 9.47618293762207;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});

AFRAME.registerComponent("late-reflection-8", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 5.426042079925537;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});

AFRAME.registerComponent("late-reflection-9", {
  init: function () {
    let sceneEl = document.querySelector("a-scene");
    this.torus = sceneEl.querySelector("#lr1");
    this.i = 0.1;
  },
  tick: function () {
    this.torus.setAttribute('radius', 1 + this.i);
    this.i += 25 / 1.875927209854126;
    if(this.torus.getAttribute('radius') > 25) {
      this.setAttribute('radius', 0.1);
    }
  }
});


//approximately: 25/latereflections durations 
//get individual velocity values and display them
// if radius is bigger than 25, start all over again x
//mermaid sound source late reflections: [3.4713995456695557, 3.628162384033203, 3.4498541355133057, 10.031046867370605, 16.801977157592773, 16.65700912475586, 9.47618293762207, 5.426042079925537, 1.875927209854126]