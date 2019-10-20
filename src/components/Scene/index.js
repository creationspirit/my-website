import React from "react"
import * as BABYLON from 'babylonjs';

import BabylonScene from './BabylonScene'
import './scene.css'


class Scene extends React.Component {
  meshesConfig = [
    {
      name: 'linkedin',
      position: new BABYLON.Vector3(3, 2, 1),
      scaling: new BABYLON.Vector3(0.3, 0.3, 0.3),
    },
    {
      name: 'facebook',
      position: new BABYLON.Vector3(-3, 2.5, 2),
      scaling: undefined,
    },
    {
      name: 'gmail',
      position: new BABYLON.Vector3(-2, 1.5, -1),
      scaling: new BABYLON.Vector3(0.5, 0.5, 0.5),
    },
    {
      name: 'github',
      position: new BABYLON.Vector3(2, 1, -2),
      scaling: new BABYLON.Vector3(15, 15, 15),
    },
    {
      name: 'cv',
      position: new BABYLON.Vector3(0, 3, 0),
      scaling: new BABYLON.Vector3(0.5, 0.5, 0.5),
    }
  ]

  meshes = {}

  addMeskImportTask = (config, assetsManager) => {
    const meshTask = assetsManager.addMeshTask(`${config.name}Task`, '', '', `${config.name}.babylon`);
    meshTask.onSuccess = task => {
      this.meshes[config.name] = task.loadedMeshes[0]
      this.meshes[config.name].position = config.position
      if (config.scaling) {
        this.meshes[config.name].scaling = config.scaling
      }
    }
    meshTask.onError = function (task, message, exception) {
      console.log(message, exception);
    }
  }

  onSceneMount = (sceneArgs) => {
    const { canvas, scene, engine } = sceneArgs

    scene.createDefaultLight()
    scene.lights[0].intensity = 1

    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 3, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    // // Default intensity is 1. Let's dim the light a small amount
    // var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, -1), scene);
    // light.position = new BABYLON.Vector3(0, 20, 20);
    // light.shadowMinZ = 15;
    // light.shadowMaxZ = 50;
    // light.intensity = 0.7;
    const light = new BABYLON.SpotLight("*spot00", new BABYLON.Vector3(10, 10, -20), new BABYLON.Vector3(0, -1, 1), Math.PI/3, 20, scene);
    light.shadowMinZ = 5;
    light.shadowMaxZ = 50;
    light.intensity = 10;


    var generator = new BABYLON.ShadowGenerator(512, light);
    generator.useContactHardeningShadow = true;
    generator.bias = 0.01;
    generator.normalBias= 0.05;
		generator.contactHardeningLightSizeUVRatio = 0.08;


    const assetsManager = new BABYLON.AssetsManager(scene);
    this.meshesConfig.forEach(config => this.addMeskImportTask(config, assetsManager))

    assetsManager.onFinish = () => {
      for (var i = 0; i < scene.meshes.length; i++) {
        generator.addShadowCaster(scene.meshes[i]);
        scene.meshes[i].receiveShadows = true;
        // if (scene.meshes[i].material && scene.meshes[i].material.bumpTexture) {
        //     scene.meshes[i].material.bumpTexture.level = 2;
        // }
      }

      const helper = scene.createDefaultEnvironment({
        skyboxSize: 1500,
        groundShadowLevel: 0.5,
        enableGroundMirror: true,
      });

      helper.setMainColor(new BABYLON.Color3(2, 2, 2));

      scene.environmentTexture.lodGenerationScale = 0.6;

      scene.registerBeforeRender(() => {
        Object.keys(this.meshes).forEach(key => {
          this.meshes[key].rotation.y += 0.005;
        })

        // torus.position = new BABYLON.Vector3(Math.cos(alpha) * 30, 10, Math.sin(alpha) * 30);
        // alpha += 0.01;

      });

      engine.runRenderLoop(() => {
          if (scene) {
              scene.render();
          }
      });
    }
    assetsManager.load()
  }
  render () {
    return (
      <BabylonScene onSceneMount={this.onSceneMount} adaptToDeviceRatio={true} />
    )
  }
}

export default Scene
