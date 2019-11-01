import * as BABYLON from 'babylonjs';
import React, { Component } from 'react';

export default class Scene extends Component {
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
    this.engine = new BABYLON.Engine(
      this.canvas.current,
      true,
      this.props.engineOptions,
      this.props.adaptToDeviceRatio
    )

    this.scene = new BABYLON.Scene(this.engine);

    this.props.onSceneMount({
      scene: this.scene,
      engine: this.engine,
      canvas: this.canvas.current,
    });

    // Resize the babylon engine when the window is resized
    window.addEventListener('resize', this.onResizeWindow)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResizeWindow)
    this.scene.dispose()
    this.engine.dispose()
  }

  render() {
    // 'rest' can contain additional properties that you can flow through to canvas:
    // (id, className, etc.)
    // eslint-disable-next-line
    const { width, height, ...rest } = this.props;

    const opts = {}
    if (width !== undefined && height !== undefined) {
      opts.width = width;
      opts.height = height;
    }

    return <canvas id="renderCanvas" {...opts} ref={this.canvas} />;
  }
}
