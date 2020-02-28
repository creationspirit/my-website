import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import React from 'react';

export default class BabylonScene extends React.Component {
  scene = null
  engine = null
  canvas = React.createRef()

  onResizeWindow = () => {
    if (this.engine) {
      this.engine.resize()
    }
  };

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    this.engine = new Engine(
      this.canvas.current,
      true,
      this.props.engineOptions,
      this.props.adaptToDeviceRatio
    )

    this.scene = new Scene(this.engine);

    this.props.onSceneMount({
      scene: this.scene,
      engine: this.engine,
      canvas: this.canvas.current,
    });

    window.addEventListener('resize', this.onResizeWindow)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow)
    this.scene.dispose()
    this.engine.dispose()
  }

  render() {
    const { width, height } = this.props;

    const opts = {}
    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    }

    return <canvas id="renderCanvas" {...opts} ref={this.canvas} />;
  }
}
