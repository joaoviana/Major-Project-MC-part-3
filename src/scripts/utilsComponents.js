var cameraPosition;

AFRAME.registerComponent("listener", {
  schema: {
    color: {
      default: '#FFF'
    },
    size: {
      type: 'int',
      default: 5
    }
  },
  init() {
    this.cameraMatrix4 = new AFRAME.THREE.Matrix4();
  },
  tick: function () {
    this.cameraMatrix4 = this.el.object3D.matrixWorld;

    if (occlusionScene) {
      occlusionScene.setListenerFromMatrix(
        new THREE.Matrix4().multiplyMatrices(
          new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
          this.el.sceneEl.camera.el.object3D.matrixWorld
        )
      );
    }
    if (caveScene) {
      caveScene.setListenerFromMatrix(
        new THREE.Matrix4().multiplyMatrices(
          new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld),
          this.el.sceneEl.camera.el.object3D.matrixWorld
        )
      );
    }
  }
});

AFRAME.registerComponent('camera-logger', {

  schema: {
    timestamp: {
      type: 'int'
    },
    seconds: {
      type: 'int'
    } // default 0
  },

  log: function () {
    var cameraEl = this.el.sceneEl.camera.el;
    var rotation = cameraEl.getAttribute('rotation');
    var worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
    return worldPos;
  },

  play: function () {
    this.data.timestamp = Date.now();
    this.log();
  },

  tick: function () {
    if (Date.now() - this.data.timestamp > 1000) {
      this.data.timestamp += 1000;
      this.data.seconds += 1;
      cameraPosition = this.log();
    }
  },
});

AFRAME.registerComponent("animate-menu-on-hover", {
  init: function () {
    this.el.addEventListener("mouseover", function (evt) {
      this.object3D.scale.set(0.7, 0.7, 0.7);
    });
    this.el.addEventListener("mouseout", function (evt) {
      this.object3D.scale.set(1, 1, 1);
    });
  }
});

AFRAME.registerComponent("animate-default-menu-item-on-hover", {
  init: function () {
    this.el.addEventListener("mouseover", function (evt) {
      this.object3D.scale.set(0.9, 0.9, 0.05);
    });
    this.el.addEventListener("mouseout", function (evt) {
      this.object3D.scale.set(0.7, 0.7, 0.03);
    });
  }
});

AFRAME.registerComponent("animate-menu-item-on-hover", {
  init: function () {
    this.el.addEventListener("mouseover", function (evt) {
      this.object3D.scale.set(0.3, 0.3, 0.05);
    });
    this.el.addEventListener("mouseout", function (evt) {
      this.object3D.scale.set(0.27, 0.27, 0.03);
    });
  }
});

AFRAME.registerComponent("go-back", {
  init: function () {
    this.el.addEventListener("click", function (evt) {
      let sceneEl = document.querySelector("a-scene");
      let mask = sceneEl.querySelector("#mask");

      if (this.id == "go-back-main-menu") {
        mask.setAttribute(
          "template",
          "src",
          "./src/templates/mainMenu/mainMenu.template"
        );
      } else if (this.id == "go-back-selection-menu") {
        //hiding environment and making a-sky visible
        let sceneEl = document.querySelector("a-scene");
        let sky = sceneEl.querySelector("#sky");
        let environment = sceneEl.querySelector("#environment");
        let ambientLight = sceneEl.querySelector("#ambient-light");
        let directionalLight = sceneEl.querySelector("#directional-light");
        sky.setAttribute('visible', 'true');
        environment.setAttribute('environment', 'active: false');

        if (occlusionAudioContext || occlusionScene) {
          humanSoundSource.disconnect(occlusionSource1.input);
          human2SoundSource.disconnect(occlusionSource2.input);
          sineSoundSource.disconnect(occlusionSource3.input);
          occlusionAudioContext = null;
          occlusionScene = null;
        }
        if (caveAudioContext || caveScene) {
          mermaidCaveSoundSource.disconnect(stormSoundSource.input);
          stormSoundSource.disconnect(lateSource1.input);
          caveAudioContext = null;
          caveScene = null;

          ambientLight.setAttribute('light', 'intensity: 0.5');
          directionalLight.setAttribute('light', 'intensity: 0.5');

          sky.setAttribute('material', 'topColor: 100 100 100');
          sky.setAttribute('material', 'bottomColor: 100 100 200');
          sky.setAttribute('visible', 'true');
          sceneEl.removeAttribute('fog');
        }
        mask.setAttribute(
          "template",
          "src",
          "./src/templates/learnMenu/learnMenu1.template"
        );
      }
    });
  }
});