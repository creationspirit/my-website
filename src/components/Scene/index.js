import React from "react"
import * as BABYLON from 'babylonjs';

import BabylonScene from './BabylonScene'
import './scene.scss'
import { GMAIL_LINK, GITHUB_PROFILE_LINK, FACEBOOK_PROFILE_LINK, LINKEDIN_PROFILE_LINK } from '../constants'

import Resume from '../../assets/andrija_perusic_resume.pdf'

class Scene extends React.Component {
  meshesConfig = [
    {
      name: 'linkedin',
      position: new BABYLON.Vector3(3, 2, 1),
      scaling: new BABYLON.Vector3(0.3, 0.3, 0.3),
      rotationSpeed: 0.0035
    },
    {
      name: 'facebook',
      position: new BABYLON.Vector3(-3, 3, 2),
      scaling: undefined,
      rotationSpeed: 0.0035
    },
    {
      name: 'gmail',
      position: new BABYLON.Vector3(-2, 1.5, -1),
      scaling: new BABYLON.Vector3(0.5, 0.5, 0.5),
      rotationSpeed: 0.0035
    },
    {
      name: 'github',
      position: new BABYLON.Vector3(2, 1, -2),
      scaling: new BABYLON.Vector3(15, 15, 15),
      rotationSpeed: 0.0035
    },
    {
      name: 'cv',
      position: new BABYLON.Vector3(0, 3, 0),
      scaling: new BABYLON.Vector3(0.5, 0.5, 0.5),
      rotationSpeed: 0.0035
    }
  ]

  meshes = {}

  linkRefs = {
    cv: React.createRef(),
    linkedin: React.createRef(),
    github: React.createRef(),
    gmail: React.createRef(),
    facebook: React.createRef(),
  }

  camera = undefined;

  componentDidMount() {
    window.addEventListener('resize', this.updateCameraFocus)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateCameraFocus)
  }

  updateCameraFocus = () => {
    if (this.camera) {
      const width = window.innerWidth
      if (width <= 640 && this.camera.target.x !== 0) {
        this.camera.target.x = 0
        this.camera.radius = 11
        this.camera.lowerRadiusLimit = 11
      }
      if (width > 640 && this.camera.target.x !== -2) {
        this.camera.target.x = -2
        this.camera.radius = 16
        this.camera.lowerRadiusLimit = 16
      }
    }
  }

  addMeskImportTask = (config, assetsManager, scene) => {
    const meshTask = assetsManager.addMeshTask(`${config.name}Task`, '', '', `${config.name}.babylon`);
    meshTask.onSuccess = task => {
      this.meshes[config.name] = task.loadedMeshes[0]
      this.meshes[config.name].position = config.position
      this.meshes[config.name].rotationSpeed = config.rotationSpeed
      if (config.scaling) {
        this.meshes[config.name].scaling = config.scaling
      }

      const actionMesh = config.name === 'gmail' ? task.loadedMeshes[2] : task.loadedMeshes[0]
      actionMesh.actionManager = new BABYLON.ActionManager(scene);
      actionMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPickTrigger,
          () => {
            this.linkRefs[config.name].current.click()
          },
        )
      )
      actionMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOverTrigger,
          () => {
            this.meshes[config.name].position.y += 0.03
            this.meshes[config.name].rotationSpeed += 0.01
          },
        )
      )
      actionMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
          BABYLON.ActionManager.OnPointerOutTrigger,
          () => {
            this.meshes[config.name].position.y -= 0.03
            this.meshes[config.name].rotationSpeed -= 0.01
          },
        )
      )
    }
    meshTask.onError = function (task, message, exception) {
      console.log(message, exception);
    }
  }

  onSceneMount = (sceneArgs) => {
    const { canvas, scene, engine } = sceneArgs

    // scene.debugLayer.show();

    scene.createDefaultLight()
    scene.lights[0].intensity = 1

    this.camera = new BABYLON.ArcRotateCamera("Camera", 5.23, 1.43, 16, new BABYLON.Vector3(-2, 1, 0), scene);
    this.camera.upperBetaLimit = Math.PI / 2;
    this.camera.lowerRadiusLimit = 16
    this.camera.upperRadiusLimit = 40
    this.camera.fovMode = BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;
    this.camera.attachControl(canvas, true);
    this.updateCameraFocus()

    const light = new BABYLON.SpotLight("*spot00", new BABYLON.Vector3(-2.19, 6.68, -4.62), new BABYLON.Vector3(-0.06, -0.75, 0.66), 1.7, 1, scene);
    light.shadowMinZ = 1;
    light.shadowMaxZ = 20;
    light.intensity = 0.7;

    var generator = new BABYLON.ShadowGenerator(512, light);
    generator.usePoissonSampling = true;

    const assetsManager = new BABYLON.AssetsManager(scene);
    assetsManager.useDefaultLoadingScreen = false;
    this.meshesConfig.forEach(config => this.addMeskImportTask(config, assetsManager, scene))

    assetsManager.onProgress = (remainingCount, totalCount) => this.props.onProgress(remainingCount, totalCount)

    assetsManager.onFinish = () => {
      Object.keys(this.meshes).forEach(key => {
        generator.addShadowCaster(this.meshes[key])
      })

      const helper = scene.createDefaultEnvironment({
        skyboxSize: 1500,
        groundShadowLevel: 0.5,
        enableGroundMirror: true,
      });

      helper.setMainColor(new BABYLON.Color3(2.8, 2.8, 2.8));

      scene.environmentTexture.lodGenerationScale = 0.6;

      scene.registerBeforeRender(() => {
        Object.keys(this.meshes).forEach(key => {
          this.meshes[key].rotation.y += this.meshes[key].rotationSpeed;
        })
      });

      engine.runRenderLoop(() => {
          if (scene) {
              scene.render();
          }
      });

      this.props.onLoaded()
    }
    assetsManager.load()
  }
  render () {
    return (
      <>
        <BabylonScene onSceneMount={this.onSceneMount} adaptToDeviceRatio={true} />
        <a ref={this.linkRefs.cv} className="hidden" target="_blank" rel="noopener noreferrer" href={Resume}>Resume</a>
        <a ref={this.linkRefs.linkedin} className="hidden" target="_blank" rel="noopener noreferrer" href={LINKEDIN_PROFILE_LINK}>Linkedin</a>
        <a ref={this.linkRefs.gmail} className="hidden" href={GMAIL_LINK}>Gmail</a>
        <a ref={this.linkRefs.facebook} className="hidden" target="_blank" rel="noopener noreferrer" href={FACEBOOK_PROFILE_LINK}>Facebook</a>
        <a ref={this.linkRefs.github} className="hidden" target="_blank" rel="noopener noreferrer" href={GITHUB_PROFILE_LINK}>Github</a>
      </>
    )
  }
}

export default Scene
