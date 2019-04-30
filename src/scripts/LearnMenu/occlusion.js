let occlusionAudioContext;
let occlusionScene;

let humanSound;
let humanSoundSource;
let human2Sound;
let human2SoundSource;
let sineSound;
let sineSoundSource;

let informationOccSound;
let informationOccSoundSource;

let occlusionSource1, occlusionSource2, occlusionSource3, occlusionSource4;
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
  // humanSoundSource.setDirectivityPattern(0.5, 5);

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

  // information recording sound
  // Create an audio element. Feed into audio graph.
  informationOccSound = document.createElement("audio");
  informationOccSound.src = "./soundFiles/occlusion-menu.m4a";
  informationOccSound.crossOrigin = "anonymous";
  informationOccSound.load();
  informationOccSoundSource = occlusionAudioContext.createMediaElementSource(informationOccSound);

  // Create a Source, connect desired audio input to it.
  occlusionSource1 = occlusionScene.createSource();
  occlusionSource1.setGain(0.7);
  occlusionSource1.setDirectivityPattern(0.7, 10);
  humanSoundSource.connect(occlusionSource1.input);

  occlusionSource2 = occlusionScene.createSource();
  occlusionSource2.setGain(0.7);
  occlusionSource2.setDirectivityPattern(0.7, 10);
  human2SoundSource.connect(occlusionSource2.input);
  
  occlusionSource3 = occlusionScene.createSource();
  occlusionSource3.setGain(1.3);
  occlusionSource3.setSourceWidth(360);
  sineSoundSource.connect(occlusionSource3.input);

  occlusionSource4 = occlusionScene.createSource();
  occlusionSource4.setGain(1.3);
  occlusionSource4.setSourceWidth(360);
  informationOccSoundSource.connect(occlusionSource4.input);

  setTimeout(() => {
    // play the sound recording
    informationOccSound.play();
  }, 3000);

  setTimeout(() => {
    // after a while, set the audio ready occlusion to true;
    console.log('audio is ready');
    audioReadyOcclusion = true;
    humanSound.setAttribute('loop', true);
    humanSound.play();
    human2Sound.setAttribute('loop', true);
    human2Sound.play();
    sineSound.setAttribute('loop', true);
    sineSound.play();
  }, 74000);
}

AFRAME.registerComponent("occlusion-sound-source-1", {
  init: function() {
    this.wpVector = new THREE.Vector3();
  },

  tick: function() {
    var cameraEl = this.el.sceneEl.camera.el;
    if (occlusionSource1) {
      occlusionSource1.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
          new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
          cameraEl.object3D.matrixWorld)
          );
    }
  }
});

AFRAME.registerComponent("occlusion-sound-source-2", {
  init: function() {
    this.wpVector = new THREE.Vector3();
  },

  tick: function() {
    var cameraEl = this.el.sceneEl.camera.el;
    if (occlusionSource2) {
      occlusionSource2.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
          new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
          cameraEl.object3D.matrixWorld)
          );
    }
  }
});

AFRAME.registerComponent("occlusion-sound-source-3", {
  init: function() {
    this.wpVector = new THREE.Vector3();
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