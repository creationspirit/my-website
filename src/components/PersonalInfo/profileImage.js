import React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Image = (name) => {
  return <StaticImage 
    className="profile-photo"
    src="../../images/profile.jpeg" alt="A profile image"
    />
}

export default Image
