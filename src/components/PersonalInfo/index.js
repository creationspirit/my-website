import React from "react"
import "./personalInfo.css"

import Image from '../image'

import { JOB_DATA } from '../constants'

const PersonalInfo = () => {
  return (
    <div className="personal-info">
      <Image/>
      <h1>Hi there!</h1>
      <h3>
        <span>I'm Andrija Perušić,<br/>
        Software engineer @ </span>
        <a target="_blank" rel="noopener noreferrer" href={JOB_DATA.url}>{JOB_DATA.name}</a>
      </h3>
      <div className="separator"></div>
      <p>
        Thank you for visiting my site! <br/>
        Please click on a corresponding 3D icon if you would like to <b>connect</b> or <b>view my work</b>.
      </p>
    </div>
  )
}

export default PersonalInfo
