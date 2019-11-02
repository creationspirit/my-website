import React, { useState } from "react"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import Scene from "../components/Scene"
import PersonalInfo from "../components/PersonalInfo"
import LoadingScreen from "../components/LoadingScreen"

const IndexPage = () => {
  const [loaded, setLoaded] = useState(false)

  const onLoaded = () => {
    // Opacity needs to be transitioned and then we remove element from DOM
    const wrapper = document.getElementById('loading-screen')
    wrapper.classList.toggle('loading-screen-hidden')
    setTimeout(() => setLoaded(true), 1600)
  }

  const onProgress = (remainingCount, totalCount) => {
    const progress = ((totalCount - remainingCount) * 100 / totalCount).toFixed(0);
    const progressElement = document.getElementById('loading-screen-progress')
    if (progressElement) {
      progressElement.innerText = `${progress}%`
    }
    if (progress >= 60) {
      const progressText = document.getElementById('loading-screen-message')
      progressText.innerText = 'Almost done...'
    }
  }

  return (
    <Layout>
      <SEO title="Welcome" />
      { !loaded && <LoadingScreen /> }
      <Scene onLoaded={onLoaded} onProgress={onProgress}/>
      <PersonalInfo />
    </Layout>
  )
}

export default IndexPage
