import React from "react"
import "./personalInfo.scss"

import ProfileImage from './profileImage'

import { JOB_DATA } from '../constants'

const handleClick = () => {
  const wrapper = document.getElementById('personal-info-wrapper')
  wrapper.classList.toggle('personal-info-hidden')
  const icon = document.getElementById('menu-icon')
  icon.classList.toggle('menu-icon-collapsed')
}

const PersonalInfo = () => {
  return (
    <>
      <div
        id="menu-icon"
        className="menu-icon"
        onClick={handleClick}
      />
      <div id="personal-info-wrapper" className="personal-info">
        <ProfileImage />
        <h1>Hi there!</h1>
        <h3>
          <span>I'm Andrija Perušić,<br/>
          Principal Software Engineer @ </span>
          <a target="_blank" rel="noopener noreferrer" href={JOB_DATA.url}>{JOB_DATA.name}</a>
        </h3>
        <p>Tech Lead for BMW's next-gen Android Automotive OS based infotainment systems connectivity apps.</p>
        <div className="separator"></div>
        <p>
          Thank you for visiting my site! <br/><br/>
          If you would like to connect, share ideas or view my work, please click on
          a corresponding object and let's build something great together.
        </p>
        <button className="toggle-overlay-button" onClick={handleClick}>Explore →</button>
      </div>
    </>
  )
}

export default PersonalInfo
