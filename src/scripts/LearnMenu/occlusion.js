let occlusionAudioContext;
let occlusionScene;
let humanSound;
let humanSoundSource;
let human2Sound;
let human2SoundSource;
let sineSound;
let sineSoundSource;
let occlusionSource1, occlusionSource2, occlusionSource3;
let audioReadyOcclusion = false;

function initOcclusionAudioContext() {
  // Set room acoustics properties.
  let occlusionDimensions = {
    width: 50,
    height: 30,
    depth: 50
  };

  let occlusionMaterial = setAllRoomProperties("transparent");

  occlusionAudioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create a (1st-order Ambisonic) ResonanceAudio scene.
  occlusionScene = new ResonanceAudio(occlusionAudioContext);

  // Send scene's rendered binaural output to stereo out.
  occlusionScene.output.connect(occlusionAudioContext.destination);

  occlusionScene.setRoomProperties(occlusionDimensions, occlusionMaterial);

  //adding 3 audio sources: two with the same sound file, one with just white noise. 

  //human sound 1
  // Create an audio element. Feed into audio graph.
  humanSound = document.createElement("audio");
  humanSound.src = "./soundFiles/whisper.wav";
  humanSound.crossOrigin = "anonymous";
  humanSound.load();
  humanSoundSource = occlusionAudioContext.createMediaElementSource(humanSound);

  //human sound 2
  // Create an audio element. Feed into audio graph.
  human2Sound = document.createElement("audio");
  human2Sound.src = "./soundFiles/whisper.wav";
  human2Sound.crossOrigin = "anonymous";
  human2Sound.load();
  human2SoundSource = occlusionAudioContext.createMediaElementSource(human2Sound);

  //sine sound 
  // Create an audio element. Feed into audio graph.
  sineSound = document.createElement("audio");
  sineSound.src = "./soundFiles/sine.wav";
  sineSound.crossOrigin = "anonymous";
  sineSound.load();
  sineSoundSource = occlusionAudioContext.createMediaElementSource(sineSound);
  // Create a Source, connect desired audio input to it.
  occlusionSource1 = occlusionScene.createSource();
  occlusionSource1.setGain(0.7);
  humanSoundSource.connect(occlusionSource1.input);

  occlusionSource2 = occlusionScene.createSource();
  occlusionSource2.setGain(0.7);
  human2SoundSource.connect(occlusionSource2.input);
  
  occlusionSource3 = occlusionScene.createSource();
  occlusionSource3.setGain(1);
  sineSoundSource.connect(occlusionSource3.input);

  audioReadyOcclusion = true;
}

AFRAME.registerComponent("occlusion-sound-source-1", {
  init: function() {
    this.wpVector = new THREE.Vector3();
    humanSound.setAttribute('loop', true);
    humanSound.play();
  },

  tick: function() {
    var cameraEl = this.el.sceneEl.camera.el;
    if (occlusionSource1) {
      occlusionSource1.setFromMatrix(new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(
          new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
          cameraEl.object3D.matrixWorld)
          ));
    }
  }
});

AFRAME.registerComponent("occlusion-sound-source-2", {
  init: function() {
    this.wpVector = new THREE.Vector3();
    var isPlaying = false;
    human2Sound.setAttribute('loop', true);
    human2Sound.play();
  },

  tick: function() {
    var cameraEl = this.el.sceneEl.camera.el;
    if (occlusionSource2) {
      occlusionSource2.setFromMatrix(new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(
          new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
          cameraEl.object3D.matrixWorld)
          ));
    }
  }
});

AFRAME.registerComponent("occlusion-sound-source-3", {
  init: function() {
    this.wpVector = new THREE.Vector3();
    sineSound.setAttribute('loop', true);
    sineSound.play();
  },

  tick: function() {
    var cameraEl = this.el.sceneEl.camera.el;
    if (occlusionSource3) {
      occlusionSource3.setFromMatrix(new THREE.Matrix4().getInverse(new THREE.Matrix4().multiplyMatrices(
          new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
          cameraEl.object3D.matrixWorld)
          ));
    }
  }
});