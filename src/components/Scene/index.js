import React from "react"

import { Vector3, Color3 } from '@babylonjs/core/Maths/math'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { SpotLight } from '@babylonjs/core/Lights/spotLight'
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator'
import { AssetsManager } from '@babylonjs/core/Misc/assetsManager'
import { ActionManager } from '@babylonjs/core/Actions/actionManager'
import { ExecuteCodeAction } from '@babylonjs/core/Actions'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import '@babylonjs/core/Loading/Plugins/babylonFileLoader'
import '@babylonjs/core/Helpers/sceneHelpers'
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent'

import BabylonScene from './BabylonScene'
import './scene.scss'
import { GMAIL_LINK, GITHUB_PROFILE_LINK, FACEBOOK_PROFILE_LINK, LINKEDIN_PROFILE_LINK } from '../constants'

import Resume from '../../assets/andrija_perusic_resume.pdf'
import BackgroundImage from '../../images/backgroundGround.png'

class SceneComponent extends React.Component {
  meshesConfig = [
    {
      name: 'linkedin',
      position: new Vector3(3, 2, 1),
      scaling: new Vector3(0.3, 0.3, 0.3),
      rotationSpeed: 0.0035,
      boxSize: { width: 1.6, height: 1.6, depth: 0.5 }
    },
    {
      name: 'facebook',
      position: new Vector3(-3, 3, 2),
      scaling: undefined,
      rotationSpeed: 0.0035,
      boxSize: { width: 1.6, height: 1.6, depth: 0.5 }
    },
    {
      name: 'gmail',
      position: new Vector3(-2, 1.5, -1),
      scaling: new Vector3(0.5, 0.5, 0.5),
      rotationSpeed: 0.0035,
      boxSize: { width: 2, height: 1.6, depth: 0.5 }
    },
    {
      name: 'github',
      position: new Vector3(2, 1, -2),
      scaling: new Vector3(15, 15, 15),
      rotationSpeed: 0.0035,
      boxSize: { width: 1.9, height: 1.9, depth: 0.5 }
    },
    {
      name: 'cv',
      position: new Vector3(0, 3, 0),
      scaling: new Vector3(0.5, 0.5, 0.5),
      rotationSpeed: 0.0035,
      boxSize: { width: 1.6, height: 2.2, depth: 0.5 }
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

  addMeskImportTask = (config, assetsManager, scene, helper, shadowGenerator) => {
    const meshTask = assetsManager.addMeshTask(`${config.name}Task`, '', '', `${config.name}.babylon`);
    meshTask.onSuccess = task => {
      task.loadedMeshes.forEach(mesh => helper.ground.material.reflectionTexture.renderList.push(mesh))
      this.meshes[config.name] = task.loadedMeshes[0]

      shadowGenerator.addShadowCaster(task.loadedMeshes[0])

      this.meshes[config.name].position = config.position
      this.meshes[config.name].rotationSpeed = config.rotationSpeed
      if (config.scaling) {
        this.meshes[config.name].scaling = config.scaling
      }

      const box = MeshBuilder.CreateBox(`${config.name}-box`, config.boxSize, scene);
      box.position = config.position.clone()
      box.setParent(this.meshes[config.name])
      box.visibility = 0

      box.actionManager = new ActionManager(scene);
      box.actionManager.registerAction(
        new ExecuteCodeAction(
          ActionManager.OnPickTrigger,
          () => {
            this.linkRefs[config.name].current.click()
          },
        )
      )
      box.actionManager.registerAction(
        new ExecuteCodeAction(
          ActionManager.OnPointerOverTrigger,
          () => {
            this.meshes[config.name].position.y += 0.03
            this.meshes[config.name].rotationSpeed += 0.01
          },
        )
      )
      box.actionManager.registerAction(
        new ExecuteCodeAction(
          ActionManager.OnPointerOutTrigger,
          () => {
            this.meshes[config.name].position.y -= 0.03
            this.meshes[config.name].rotationSpeed -= 0.01
          },
        )
      )

      scene.registerBeforeRender(() => {
        this.meshes[config.name].rotation.y += this.meshes[config.name].rotationSpeed;
      })
    }
  }

  onSceneMount = (sceneArgs) => {
    const { canvas, scene, engine } = sceneArgs

    scene.createDefaultLight()
    scene.lights[0].intensity = 1.5
    scene.clearColor = new Color3(0.95, 0.95, 1)

    const helper = scene.createDefaultEnvironment({
      createSkybox: false,
      groundShadowLevel: 0.5,
      enableGroundMirror: true,
      environmentTexture: undefined,
      skyboxTexture: undefined,
      groundTexture: BackgroundImage,
      groundColor: new Color3(1, 1, 1),
    });
    helper.ground.scaling = new Vector3(1.6, 1.6, 1)

    this.camera = new ArcRotateCamera('camera', 5.23, 1.43, 16, new Vector3(-2, 1, 0), scene);
    this.camera.upperBetaLimit = Math.PI / 2;
    this.camera.lowerRadiusLimit = 16
    this.camera.upperRadiusLimit = 40
    this.camera.fovMode = ArcRotateCamera.FOVMODE_HORIZONTAL_FIXED
    this.camera.attachControl(canvas, true, false);
    this.updateCameraFocus()

    const light = new SpotLight('spotlight', new Vector3(-2.19, 6.68, -4.62), new Vector3(-0.06, -0.75, 0.66), 1.7, 1, scene);
    light.shadowMinZ = 1;
    light.shadowMaxZ = 20;
    light.intensity = 0.7;

    engine.runRenderLoop(() => {
        scene.render();
    });

    const shadowGenerator = new ShadowGenerator(512, light);
    shadowGenerator.usePoissonSampling = true;

    const assetsManager = new AssetsManager(scene);
    assetsManager.useDefaultLoadingScreen = false;
    this.meshesConfig.forEach(config => this.addMeskImportTask(config, assetsManager, scene, helper, shadowGenerator))

    assetsManager.onProgress = (remainingCount, totalCount) => this.props.onProgress(remainingCount, totalCount)
    assetsManager.onFinish = () => this.props.onLoaded()

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

export default SceneComponent
