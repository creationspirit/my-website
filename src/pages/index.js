import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Scene from "../components/Scene"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Scene />
  </Layout>
)

export default IndexPage
