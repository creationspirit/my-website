import React from 'react'
import './loadingScreen.scss'

const LoadingScreen = () => {
  return (
    <div className={"loading-screen-container"} id="loading-screen">
      <div className="loading-screen-content">
        <div className="lds-dual-ring">
          <div className="loading-progress" id="loading-screen-progress">0%</div>
        </div>
        <div className="loading-message" id="loading-screen-message">
          Loading some assets. Please wait a moment.
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
