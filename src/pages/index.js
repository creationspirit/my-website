import React from "react"

import Layout from "../components/Layout"
import SEO from "../components/seo"
import Scene from "../components/Scene"
import PersonalInfo from "../components/PersonalInfo"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Scene />
    <PersonalInfo />
  </Layout>
)

export default IndexPage
