import React from "react"
import * as BABYLON from 'babylonjs';

import BabylonScene from './BabylonScene'
import './scene.css'

const Scene = () => {
  const onSceneMount = (sceneArgs) => {
    const { canvas, scene, engine } = sceneArgs

    scene.createDefaultLight()
    scene.lights[0].intensity = 0.5
    // This creates and positions a free camera (non-mesh)
    const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    // const camera = new BABYLON.ArcRotateCamera("camera1")

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    // const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

    // // Default intensity is 1. Let's dim the light a small amount
    // light.intensity = 0.7;
    // var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, -1), scene);
    // light.position = new BABYLON.Vector3(0, 20, 20);
    // light.shadowMinZ = 15;
    // light.shadowMaxZ = 50;
    // light.intensity = 0.7;

    var light = new BABYLON.SpotLight("*spot00", new BABYLON.Vector3(10, 10, -20), new BABYLON.Vector3(0, -1, 1), 1.2, 15, scene);
    light.shadowMinZ = 5;
    light.shadowMaxZ = 50;
    light.intensity = 0.7;


    var generator = new BABYLON.ShadowGenerator(512, light);
    generator.useContactHardeningShadow = true;
    generator.bias = 0.01;
    generator.normalBias= 0.05;
		generator.contactHardeningLightSizeUVRatio = 0.08;


    // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
    const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

    // Move the sphere upward 1/2 its height
    sphere.position = new BABYLON.Vector3(3, 1, -2);

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

    helper.setMainColor(BABYLON.Color3.Gray());

    scene.environmentTexture.lodGenerationScale = 0.6;

    engine.runRenderLoop(() => {
        if (scene) {
            scene.render();
        }
    });
}
  return (
    <BabylonScene onSceneMount={onSceneMount} adaptToDeviceRatio={true} />
  )
}

export default Scene
