import React from 'react'
import './loadingScreen.scss'

const LoadingScreen = () => {
  return (
    <div className="loading-screen-container" id="loading-screen">
      <div className="lds-dual-ring">
        <div className="loading-progress" id="loading-screen-progress">0%</div>
      </div>
      <p className="loading-message" id="loading-screen-message">
        Loading some assets. Please wait a moment.
      </p>
    </div>
  )
}

export default LoadingScreen
